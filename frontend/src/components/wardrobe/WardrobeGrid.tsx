import { useEffect, useState } from 'react';
import { ClothingItem, getWardrobeItems, getImageUrl } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

type WardrobeItems = {
  upper: ClothingItem[];
  lower: ClothingItem[];
  other: ClothingItem[];
};

export default function WardrobeGrid() {
  const [wardrobe, setWardrobe] = useState<WardrobeItems>({ upper: [], lower: [], other: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        const items = await getWardrobeItems();
        const categorized = items.reduce<WardrobeItems>(
          (acc, item) => {
            if (item.body_part?.toLowerCase().includes('upper') || item.category?.toLowerCase().includes('shirt')) {
              acc.upper.push(item);
            } else if (item.body_part?.toLowerCase().includes('lower') || item.category?.toLowerCase().includes('pant')) {
              acc.lower.push(item);
            } else {
              acc.other.push(item);
            }
            return acc;
          },
          { upper: [], lower: [], other: [] }
        );
        setWardrobe(categorized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wardrobe');
        console.error('Error fetching wardrobe:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWardrobe();
  }, []);

  const renderItemCard = (item: ClothingItem) => (
    <Card key={item._id} className="overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={getImageUrl(item.image_path.split('/').pop() || '')}
          alt={item.category || 'Clothing item'}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            // Fallback to original path if getImageUrl fails
            if (e.currentTarget.src !== item.image_path) {
              e.currentTarget.src = item.image_path;
            }
          }}
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium">
          {item.category || 'Clothing Item'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">
          {item.color} {item.style || ''} 
        </p>
      </CardContent>
    </Card>
  );

  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ));

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Wardrobe</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="upper">Upper Body</TabsTrigger>
          <TabsTrigger value="lower">Lower Body</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <h2 className="mb-4 text-xl font-semibold">All Clothing Items</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {isLoading ? (
              renderSkeletons(8)
            ) : (
              [...wardrobe.upper, ...wardrobe.lower, ...wardrobe.other].map(renderItemCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="upper">
          <h2 className="mb-4 text-xl font-semibold">Upper Body</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {isLoading ? renderSkeletons(4) : wardrobe.upper.map(renderItemCard)}
          </div>
        </TabsContent>

        <TabsContent value="lower">
          <h2 className="mb-4 text-xl font-semibold">Lower Body</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {isLoading ? renderSkeletons(4) : wardrobe.lower.map(renderItemCard)}
          </div>
        </TabsContent>

        <TabsContent value="other">
          <h2 className="mb-4 text-xl font-semibold">Other Items</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {isLoading ? renderSkeletons(4) : wardrobe.other.map(renderItemCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
