import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Menu {
    id: number;
    name: string;   // note: in DB you used "name", not "title"
    parent_id: number | null;
    sort_number: number;
    status: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface ApiResponse {
    data: Menu[];
    current_page: number;
    last_page: number;
    links: PaginationLinks[];
}

export default function Dashboard() {
    // const { props } = usePage();
    // const menus = props.menus || [];
      const [menus, setMenus] = useState<Menu[]>([]);
      const [pagination, setPagination] = useState<ApiResponse | null>(null);
    
      // Load menus from API
      const loadMenus = async (page: number = 1) => {
        try {
          const res = await fetch(`/api/menus?page=${page}`);
          if (!res.ok) throw new Error("Failed to fetch menus");
          const data: ApiResponse = await res.json();
          setMenus(data.data);
          setPagination(data);
        } catch (err) {
          console.error(err);
        }
      };
    
      useEffect(() => {
        loadMenus(1);
      }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs} menus={[]}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <div className="p-6">
                    <h1 className="text-xl font-bold mb-12 ml-0">All Menus</h1>

                    <table className="min-w-full border border-gray-300 mt-5 rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">Title</th>
                                <th className="p-2 border">Parent</th>
                                <th className="p-2 border">Sort</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menus.length > 0 ? (
                                menus.map((menu) => (
                                    <tr key={menu.id} className="text-center">
                                        <td className="p-2 border">{menu.id}</td>
                                        <td className="p-2 border">{menu.name}</td>
                                        <td className="p-2 border">{menu.parent_id ?? "—"}</td>
                                        <td className="p-2 border">{menu.sort_number}</td>
                                        <td className="p-2 border">{menu.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-gray-500">
                                        No menus found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                    <div className="flex gap-2 mt-45 ml-29">
                        {pagination?.links.map((link, idx) => (
                            <button
                                key={idx}
                                disabled={!link.url}
                                onClick={() => {
                                    const pageMatch = link.url?.match(/page=(\d+)/);
                                    if (pageMatch) loadMenus(Number(pageMatch[1]));
                                }}
                                className={`px-6 py-1 rounded border cursor-pointer ${link.active ? "bg-black text-white" : "bg-gray-200"
                                    }`}
                            >
                                {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
                            </button>
                        ))}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}