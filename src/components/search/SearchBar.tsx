// SearchBar.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, Home } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { getCurrentLocation } from '@/services/getCurrentLocation';
import {client} from "@/lib/amplifyClient.ts";
import {fetchUserAttributes} from "aws-amplify/auth";

interface SearchBarProps {
    onSearch: (params: {
        query: string;
        radius: number | null;
        latitude?: number;
        longitude?: number;
    }) => void;
}

//TODO: change locations of all books in book_index when user changes home address
//TODO: Make Book cards clickable -> takes you to the books page.
//TODO: Work out how loaning function should work

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [tempRadius, setTempRadius] = useState<number>(10);
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [homeCoords, setHomeCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [enableDistance, setEnableDistance] = useState<boolean>(false);

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

        if (enableDistance) {
            coords = useCurrentLocation
                ? await getCurrentLocation()
                : homeCoords;
        }

        onSearch({
            query,
            radius: enableDistance ? tempRadius * 1000 : null,
            latitude: enableDistance ? coords?.latitude : undefined,
            longitude: enableDistance ? coords?.longitude : undefined,
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-2xl p-6 shadow-lg space-y-5">
                {/* Main Search Input */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search books by title, author, or ISBN..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="h-12 text-base pl-4 pr-4 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        />
                    </div>
                    <Button
                        onClick={handleSearch}
                        className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                </div>

                {/* Distance and Location Filters */}
                <div className="border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Distance Filter */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-700">
                                    Distance filter
                                </h3>
                                <Switch
                                    checked={enableDistance}
                                    onCheckedChange={setEnableDistance}
                                />
                            </div>

                            {enableDistance && (
                                <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Within</span>
                                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                            {tempRadius} km
                                        </span>
                                    </div>
                                    <Slider
                                        min={1}
                                        max={20}
                                        step={1}
                                        value={[tempRadius]}
                                        onValueChange={([value]) => setTempRadius(value)}
                                        className="cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Location Selection - Only shown when distance filter is enabled */}
                        {enableDistance && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    Where are you..
                                </h3>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        {useCurrentLocation ? (
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Home className="w-4 h-4 text-green-600" />
                                        )}
                                        <span className="text-sm text-gray-700">
                                            {useCurrentLocation ? 'Current location' : 'Home address'}
                                        </span>
                                    </div>
                                    <Switch
                                        checked={useCurrentLocation}
                                        onCheckedChange={setUseCurrentLocation}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;