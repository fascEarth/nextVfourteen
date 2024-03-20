

import { lusitana } from '@/app/ui/fonts';
import { fetchFilteredCustomers } from '../../lib/data';
import { Suspense } from 'react';
import { CardSkeleton } from '@/app/ui/skeletons';
import CustomersTable from '@/app/ui/customers/table';
export default async function Page({
  searchParams,
}: {
  searchParams?: {
      query?: string;
      page?: string;
  };
}) {
    
  const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

   
    //const fetchedCustomersData = await fetchFilteredCustomers("");
  return (
    <main>
     
     
       <Suspense fallback={<CardSkeleton />}>
        <CustomersTable  query={query} currentPage={currentPage} />
       </Suspense>
     
      
    </main>
  );
}