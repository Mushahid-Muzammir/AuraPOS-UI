import { QueryClient } from '@tanstack/react-query';

export const queryConfig = new QueryClient({
    defaultOptions : {
        queries:{
            retry:3, //Allow 3 retries on failure
            refetchOnWindowFocus:false, //Disable refetching on window re-focuses
            staleTime:5 * 60 * 1000, //Data is considered fresh for 5 minutes
            gcTime:30 * 60 * 1000, //Cache data for 30 minutes
            refetchOnReconnect : true, //Refetch data when reconnecting to the internet for offline -> online scenarios
            throwOnError : false
        },
        mutations:{
            retry:1,
            throwOnError : true
        }
    }
})