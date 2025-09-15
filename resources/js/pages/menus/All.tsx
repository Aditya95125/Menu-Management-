// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function MenuList() {
//   const [menus, setMenus] = useState([]);
//   const [meta, setMeta] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     setLoading(true);
//     axios.get(`/api/menus?page=${page}`)
//       .then(res => {
//         setMenus(res.data.data);
//         setMeta(res.data);
//       })
//       .finally(() => setLoading(false));
//   }, [page]);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Menus</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {menus.map(menu => (
//             <li key={menu.id}>
//               {menu.name}
//               {menu.children?.length > 0 && (
//                 <ul className="ml-4 list-disc">
//                   {menu.children.map(child => (
//                     <li key={child.id}>{child.name}</li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Pagination controls */}
//       <div className="flex gap-2 mt-4">
//         <button
//           onClick={() => setPage(prev => Math.max(prev - 1, 1))}
//           disabled={page === 1}
//         >
//           Previous
//         </button>

//         <span>Page {meta.current_page} of {meta.last_page}</span>

//         <button
//           onClick={() => setPage(prev => (meta.last_page ? Math.min(prev + 1, meta.last_page) : prev))}
//           disabled={page === meta.last_page}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { router } from "@inertiajs/react";

// interface Menu {
//   id: number;
//   title: string;
//   parent_id: number | null;
//   sort_number: number;
//   status: string;
// }

// interface PaginationLinks {
//   url: string | null;
//   label: string;
//   active: boolean;
// }

// interface ApiResponse {
//   data: Menu[];
//   current_page: number;
//   last_page: number;
//   links: PaginationLinks[];
// }

// export default function All() {
//   const [menus, setMenus] = useState<Menu[]>([]);
//   const [pagination, setPagination] = useState<ApiResponse | null>(null);

//   // Load menus from API
//   const loadMenus = (page: number = 1) => {
//     router.get(
//       `/api/menus?page=${page}`,
//       {},
//       {
//         preserveState: true,
//         preserveScroll: true,
//         only: [],
//         onSuccess: (pageData: any) => {
//           // because API returns JSON, not Inertia props
//           setMenus(pageData.props?.data?.data || []);
//           setPagination(pageData.props?.data || null);
//         },
//       }
//     );
//   };

//   useEffect(() => {
//     loadMenus(1);
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">All Menus </h1>

//       {/* Table */}
//       <table className="min-w-full border border-gray-300 rounded-md">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2 border">ID</th>
//             <th className="p-2 border">Title</th>
//             <th className="p-2 border">Parent</th>
//             <th className="p-2 border">Sort #</th>
//             <th className="p-2 border">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {menus.length > 0 ? (
//             menus.map((menu) => (
//               <tr key={menu.id} className="text-center">
//                 <td className="p-2 border">{menu.id}</td>
//                 <td className="p-2 border">{menu.title}</td>
//                 <td className="p-2 border">{menu.parent_id ?? "—"}</td>
//                 <td className="p-2 border">{menu.sort_number}</td>
//                 <td className="p-2 border">{menu.status}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={5} className="p-4 text-gray-500">
//                 No menus found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination Buttons */}
//       <div className="flex gap-2 mt-4">
//         {pagination?.links.map((link, idx) => (
//           <button
//             key={idx}
//             disabled={!link.url}
//             onClick={() => {
//               const pageMatch = link.url?.match(/page=(\d+)/);
//               if (pageMatch) loadMenus(Number(pageMatch[1]));
//             }}
//             className={`px-3 py-1 rounded border ${
//               link.active ? "bg-black text-white" : "bg-gray-200"
//             }`}
//           >
//             {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";

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

export default function All() {
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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6 ml-120">All Menus</h1>

      <table className="min-w-full border border-gray-300 rounded-md">
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

     
      <div className="flex gap-2 mt-60 ml-70">
        {pagination?.links.map((link, idx) => (
          <button
            key={idx}
            disabled={!link.url}
            onClick={() => {
              const pageMatch = link.url?.match(/page=(\d+)/);
              if (pageMatch) loadMenus(Number(pageMatch[1]));
            }}
            className={`px-6 py-1 rounded border cursor-pointer ${
              link.active ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
          </button>
        ))}
      </div>
    </div>
  );
}

