import { useEffect } from "react";
import { useForm } from "react-hook-form";

type SearchBoxProps = {
    onSearch: (term: string) => void;
}

export function SearchBox(prop: SearchBoxProps) {
    const { onSearch } = prop;
    const { register, watch } = useForm<{ search: string }>();
    const searchTerm = watch('search');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(searchTerm);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, onSearch]);

    return (
        <input {...register('search')} type="search" placeholder="Search transaction..." />
    );
}