// SearchBar.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { getCurrentLocation } from '@/services/getCurrentLocation';
import {client} from "@/lib/amplifyClient.ts";
import {fetchUserAttributes} from "aws-amplify/auth";

// TODO: Add endpoint to pg search query as env to amplify console

interface SearchBarProps {
    onSearch: (params: {
        query: string;
        radius: number | null;
        latitude?: number;
        longitude?: number;
    }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [tempRadius, setTempRadius] = useState<number>(10);
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [homeCoords, setHomeCoords] = useState<{ latitude: number; longitude: number } | null>(null);



    useEffect(() => {
        const fetchUserCoordinates = async () => {
            try {
                const attrs = await fetchUserAttributes();
                const currentUserSub = attrs.sub;

                if (!currentUserSub) {
                    console.error('User sub is undefined.');
                    return;
                }

                const { data: user } = await client.models.User.get({ sub: currentUserSub });

                if (user?.coordinates) {
                    setHomeCoords({
                        latitude: user.coordinates.lat,
                        longitude: user.coordinates.long,
                    });
                }
                else {
                    console.log('User coord not found, could redirect to /setup here!');
                }
            } catch (err) {
                console.error('Failed to fetch user coordinates:', err);
            }
        };

        fetchUserCoordinates();
    }, []);
    const handleSearch = async () => {
        let coords = null;
        if (useCurrentLocation) {
            coords = await getCurrentLocation();
        } else {
            coords = homeCoords;
        }

        onSearch({
            query,
            radius: tempRadius,
            latitude: coords?.latitude,
            longitude: coords?.longitude,
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg shadow-gray-100/50 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Input
                        placeholder="Search by title, author, or ISBN..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="h-10 text-lg border-0 bg-gray-50/50 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 flex-1"
                    />
                    <Button
                        onClick={handleSearch}
                        className="h-10 px-6 bg-gradient-to-r from-blue-300 to-blue-400 hover:from-blue-500 hover:to-blue-600 cursor-pointer rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                </div>

                <div className="flex items-center justify-between gap-6 flex-wrap">
                    <div className="flex items-center gap-4 flex-1">
                        <span className="text-sm font-medium text-gray-600 min-w-fit">Search radius</span>
                        <div className="flex-1 max-w-xs">
                            <Slider
                                min={1}
                                max={20}
                                step={1}
                                value={[tempRadius]}
                                onValueChange={([value]) => setTempRadius(value)}
                                className="cursor-pointer"
                            />
                        </div>
                        <div className="min-w-fit">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {tempRadius} km
              </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Use current location</span>
                        <Switch checked={useCurrentLocation} onCheckedChange={setUseCurrentLocation} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
