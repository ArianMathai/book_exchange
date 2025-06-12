// pages/Home.tsx
import { useState, useEffect } from 'react';
import { useBookIndex } from '@/lib/hooks/useBooksFetcher';
import SearchBar from '@/components/search/SearchBar';
import PaginationControls from '@/components/search/PaginationControls';

const Home: React.FC = () => {
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({
        page: 0,
        query: '',
        radius: 10,
        latitude: undefined as number|undefined,
        longitude: undefined as number|undefined,
    });

    // whenever page state changes, drive params.page
    useEffect(() => {
        setParams(p => ({ ...p, page }));
    }, [page]);

    const { data, isLoading, error } = useBookIndex(params);

    // log whenever we get new IDs
    useEffect(() => {
        if (data) console.log('📚 fetched ids:', data.ids);
    }, [data]);

    return (
        <div>
            <SearchBar
                onSearch={({ query, radius, latitude, longitude }) => {
                    setPage(0);
                    setParams({ page: 0, query, radius: radius ?? 10, latitude, longitude });
                }}
            />
            {isLoading && <p>Loading…</p>}
            {error && <p className="text-red-500">Error: {error.message}</p>}
            {data && (
                <div>
                    <p>Page {data.page + 1} of {data.totalPages}</p>
                    <ul>
                        {data.ids.map(id => <li key={id}>{id}</li>)}
                    </ul>
                </div>
            )}
            <PaginationControls
                page={page}
                setPage={setPage}
                totalPages={data?.totalPages ?? 0}
            />
        </div>
    );
};
export default Home;