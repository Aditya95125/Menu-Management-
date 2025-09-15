<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;


class MenuController extends Controller
{
    public function showAll()
{
    // Inertia page that will fetch from /api/menus
    return Inertia::render('menus/All');
}

    public function getall()
    {
       return Menu::paginate(3);
        // return response()->json($menus);
    }

    public function index()
    {
        $menus = Menu::with('childrenRecursive') //children
            ->whereNull('parent_id')
            ->orderBy('sort_number')
            ->get();

        return Inertia::render('menus/Index', [ //menus/Index
            'menus' => $menus
        ]);
    }

    // public function reorder(Request $request)
    // {
    //     $ids = $request->input('ids');           // array of menu IDs in new order
    //     foreach ($ids as $index => $id) {
    //         Menu::where('id', $id)->update(['sort_number' => $index]);
    //     }
    //     return response()->json(['status' => 'success']);
    // }

    // public function reorder(Request $request)
    // {
    //     $items = $request->input('items');
    //     // items = [ {id: 1, parent_id: null, sort_number: 0}, {...} ]

    //     foreach ($items as $item) {
    //         Menu::where('id', $item['id'])->update([
    //             'parent_id' => $item['parent_id'],
    //             'sort_number' => $item['sort_number'],
    //         ]);
    //     }

    //     return response()->json(['status' => 'success']);
    // }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:menus,id',
            'new_parent_id' => 'nullable|integer|exists:menus,id',
            'new_sort_number' => 'required|integer',
        ]);

        $menu = Menu::findOrFail($validated['id']);
        // Prevent invalid moves (self or child)
        if ($request->new_parent_id && $request->new_parent_id == $menu->id) {
            return back()->with('error', 'Invalid move');
        }
        $menu->parent_id = $validated['new_parent_id'];
        $menu->sort_number = $validated['new_sort_number'];
        $menu->save();

        return redirect()->back()->with('success', 'Menu reordered');
    }




    public function move(Request $request, Menu $menu)
    {
        $request->validate([
            'parent_id' => 'nullable|exists:menus,id',
        ]);

        $menu->update(['parent_id' => $request->parent_id]);

        return response()->json(['status' => 'success']);
    }



    public function create()
    {
        // $parents = Menu::whereNull('parent_id')->get();
        $parents = Menu::all();

        return Inertia::render('menus/Create', [
            'parents' => $parents
        ]);
    }


    public function save(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'url'         => 'nullable|string|max:255',
            'icon'        => 'nullable|string|max:255',
            'parent_id'   => 'nullable|exists:menus,id',
            'status'      => 'required|in:Active,Inactive',
            'sort_number' => 'nullable|integer|min:0'
        ]);

        Menu::create($request->only('name', 'url', 'icon', 'parent_id', 'status', 'sort_number'));

        return redirect('/dashboard')->with('success', 'Menu created successfully!');
    }

    // public function edit(Menu $menu)
    // {
    //     $parents = Menu::where('parent_id')
    //         ->where('id', '!=', $menu->id)
    //         ->get();

    //     return Inertia::render('menus/Edit', [
    //         'menu' => $menu,
    //         'parents' => $parents,
    //     ]);
    // }

    public function edit(Menu $menu)
    {
        // Get all descendant IDs of this menu
        $descendantIds = $this->getDescendantIds($menu);

        // Exclude current menu and its descendants
        $parents = Menu::whereNotIn('id', $descendantIds)
            ->where('id', '!=', $menu->id)
            ->get();

        return Inertia::render('menus/Edit', [
            'menu' => $menu,
            'parents' => $parents,
        ]);
    }

    /**
     * Recursively get all descendant IDs of a menu.
     */
    private function getDescendantIds($menu)
    {
        $ids = [];

        foreach ($menu->children as $child) {
            $ids[] = $child->id;
            $ids = array_merge($ids, $this->getDescendantIds($child));
        }

        return $ids;
    }


    public function update(Request $request, Menu $menu)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'status' => 'required|in:Active,Inactive',
        ]);
        $menu->update($request->all());
        return redirect('/all');
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();
        return redirect('/dashboard');
    }
}
