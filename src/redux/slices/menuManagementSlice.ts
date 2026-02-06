import { createSlice, createAsyncThunk, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

/* ===================== TYPES ===================== */

export interface Category {
  id: number;
  name: string;
  is_active: boolean;
}

export interface SubCategory {
  id: number;
  name: string;
  category: number;
  is_active: boolean;
}

export interface MenuItem {
  id: number;
  item_name: string;
  price: number;
  description: string;
  category: number;
  sub_category: number;
  is_available: boolean;
  image?: string;
}

export interface VariationGroup {
  id: number;
  name: string;
  description: string;
  display_order: number;
}

export interface Variation {
  id: number;
  variant_group: number;
  name: string;
  price: number;
  is_default: boolean;
  display_order: number;
}

export interface MenuItemVariationGroup {
  id: number;
  menu_item: number;
  variant_group: number;
  is_required: boolean;
  display_order: number;
}

export interface AddonGroup {
  id: number;
  name: string;
  description: string;
  is_required: boolean;
  min_selections: number;
  max_selections: number;
  display_order: number;
}

export interface Addon {
  id: number;
  restaurant: number;
  addon_group: number;
  name: string;
  price: number;
  description: string;
}

export interface MenuItemAddon {
  id: number;
  menu_item: number;
  addon_group: number;
}

export interface ModifierGroup {
  id: number;
  name: string;
  description: string;
  selection_type: string;
  min_selections: number;
  max_selections: number;
  display_order: number;
}

export interface Modifier {
  id: number;
  modifier_group: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  is_default: boolean;
  display_order: number;
}

export interface MenuItemModifierGroup {
  id: number;
  menu_item: number;
  modifier_group: number;
  is_required: boolean;
  display_order: number;
  depends_on_variant?: number;
}

interface MenuManagementState {
  categories: Category[];
  subCategories: SubCategory[];
  menuItems: MenuItem[];
  variationGroups: VariationGroup[];
  variations: Variation[];
  menuItemVariationGroups: MenuItemVariationGroup[];
  addonGroups: AddonGroup[];
  addons: Addon[];
  menuItemAddons: MenuItemAddon[];
  modifierGroups: ModifierGroup[];
  modifiers: Modifier[];
  menuItemModifierGroups: MenuItemModifierGroup[];
  isLoading: boolean;
  success: boolean | null;
  error: string | null;
}

export interface StatusResponse {
  status?: number;
  message?: string;
  result?: string | number;
}

/* ===================== INITIAL STATE ===================== */

const initialState: MenuManagementState = {
  categories: [],
  subCategories: [],
  menuItems: [],
  variationGroups: [],
  variations: [],
  menuItemVariationGroups: [],
  addonGroups: [],
  addons: [],
  menuItemAddons: [],
  modifierGroups: [],
  modifiers: [],
  menuItemModifierGroups: [],
  isLoading: false,
  success: null,
  error: null,
};

/* ===================== GENERIC API THUNK ===================== */

export function createApiThunk<T = any, U = void>(type: string, apiCall: (arg: U) => Promise<T>) {
  return createAsyncThunk<T, U>(type, async (arg, { rejectWithValue }) => {
    try {
      return await apiCall(arg);
    } catch (error: any) {
      const message = error?.response?.data?.data?.message || error?.response?.data?.data?.error || error?.message || 'Something went wrong';
      return rejectWithValue(message);
    }
  });
}

/* ===================== CATEGORY THUNKS ===================== */

export const getCategories = createApiThunk('menuManagement/getCategories', () => axiosInstance.get('/category'));

export const addCategory = createApiThunk('menuManagement/addCategory', (payload: { name: string }) => axiosInstance.post('/category', payload));

export const updateCategory = createApiThunk('menuManagement/updateCategory', (payload: { id: number; name: string }) =>
  axiosInstance.patch(`/category/${payload.id}`, {
    name: payload.name,
  }),
);

export const deleteCategory = createApiThunk('menuManagement/deleteCategory', (id: number) => axiosInstance.delete(`/category/${id}`));

/* ===================== SUBCATEGORY THUNKS ===================== */

export const getAllSubCategories = createApiThunk('menuManagement/getAllSubCategories', () => axiosInstance.get('/subcategory'));

export const addSubCategory = createApiThunk('menuManagement/addSubCategory', (payload: { name: string; category: number }) => axiosInstance.post('/subcategory', payload));

export const updateSubCategory = createApiThunk('menuManagement/updateSubCategory', (payload: { id: number; name: string; category: number }) =>
  axiosInstance.patch(`/subcategory/${payload.id}`, {
    name: payload.name,
    category: payload.category,
  }),
);

export const deleteSubCategory = createApiThunk('menuManagement/deleteSubCategory', (id: number) => axiosInstance.delete(`/subcategory/${id}`));

/* ===================== MENU ITEM THUNKS ===================== */

export const getMenuItems = createApiThunk('menuManagement/getMenuItems', () => axiosInstance.get('/menu'));

export const getMenuItemById = createApiThunk('menuManagement/getMenuItemById', (id: number) => axiosInstance.get(`/menu/${id}`));

// Fixed: Use /menu-item-creation/ for both create and update
export const addMenuItem = createApiThunk('menuManagement/addMenuItem', (payload: any) =>
  axiosInstance.post('/menu-item-creation', payload, {
    headers: { 'Content-Type': 'application/json' },
  }),
);

export const updateMenuItem = createApiThunk('menuManagement/updateMenuItem', (payload: { id: number; data: any }) =>
  axiosInstance.patch(`/menu-item-creation/${payload.id}`, payload.data, {
    headers: { 'Content-Type': 'application/json' },
  }),
);

export const deleteMenuItem = createApiThunk('menuManagement/deleteMenuItem', (id: number) => axiosInstance.delete(`/menu/${id}/`));

/* ===================== VARIATION GROUP THUNKS ===================== */

export const getVariationGroups = createApiThunk('menuManagement/getVariationGroups', () => axiosInstance.get('/variation-group'));

export const addVariationGroup = createApiThunk('menuManagement/addVariationGroup', (payload: { name: string; description: string; display_order: number }) =>
  axiosInstance.post('/variation-group', payload),
);

export const updateVariationGroup = createApiThunk('menuManagement/updateVariationGroup', (payload: { id: number; name: string; description: string; display_order: number }) =>
  axiosInstance.patch(`/variation-group/${payload.id}`, {
    name: payload.name,
    description: payload.description,
    display_order: payload.display_order,
  }),
);

export const deleteVariationGroup = createApiThunk('menuManagement/deleteVariationGroup', (id: number) => axiosInstance.delete(`/variation-group/${id}`));

/* ===================== VARIATION THUNKS ===================== */

export const getVariations = createApiThunk('menuManagement/getVariations', () => axiosInstance.get('/variation'));

export const addVariation = createApiThunk(
  'menuManagement/addVariation',
  (payload: { variant_group: number; name: string; price: number; is_default: boolean; display_order: number }) => axiosInstance.post('/variation', payload),
);

export const updateVariation = createApiThunk(
  'menuManagement/updateVariation',
  (payload: { id: number; variant_group: number; name: string; price: number; is_default: boolean; display_order: number }) =>
    axiosInstance.patch(`/variation/${payload.id}`, {
      variant_group: payload.variant_group,
      name: payload.name,
      price: payload.price,
      is_default: payload.is_default,
      display_order: payload.display_order,
    }),
);

export const deleteVariation = createApiThunk('menuManagement/deleteVariation', (id: number) => axiosInstance.delete(`/variation/${id}`));

/* ===================== MENU ITEM VARIATION GROUP THUNKS ===================== */

export const getMenuItemVariationGroups = createApiThunk('menuManagement/getMenuItemVariationGroups', (menuItemId: number) =>
  axiosInstance.get(`/menu-item-variation-group?menu_item=${menuItemId}`),
);

export const assignVariationGroupToMenuItem = createApiThunk(
  'menuManagement/assignVariationGroupToMenuItem',
  (payload: { menu_item: number; variant_group: number; is_required: boolean; display_order: number }) => axiosInstance.post('/menu-item-variation-group', payload),
);

export const updateMenuItemVariationGroup = createApiThunk(
  'menuManagement/updateMenuItemVariationGroup',
  (payload: { id: number; menu_item: number; variant_group: number; is_required: boolean; display_order: number }) =>
    axiosInstance.patch(`/menu-item-variation-group/${payload.id}`, {
      menu_item: payload.menu_item,
      variant_group: payload.variant_group,
      is_required: payload.is_required,
      display_order: payload.display_order,
    }),
);

export const unassignVariationGroupFromMenuItem = createApiThunk('menuManagement/unassignVariationGroupFromMenuItem', (id: number) =>
  axiosInstance.delete(`/menu-item-variation-group/${id}`),
);

/* ===================== ADDON GROUP THUNKS ===================== */

export const getAddonGroups = createApiThunk('menuManagement/getAddonGroups', () => axiosInstance.get('/addon-group'));

export const addAddonGroup = createApiThunk(
  'menuManagement/addAddonGroup',
  (payload: { name: string; description: string; is_required: boolean; min_selections: number; max_selections: number; display_order: number }) =>
    axiosInstance.post('/addon-group', payload),
);

export const updateAddonGroup = createApiThunk(
  'menuManagement/updateAddonGroup',
  (payload: { id: number; name: string; description: string; is_required: boolean; min_selections: number; max_selections: number; display_order: number }) =>
    axiosInstance.patch(`/addon-group/${payload.id}`, {
      name: payload.name,
      description: payload.description,
      is_required: payload.is_required,
      min_selections: payload.min_selections,
      max_selections: payload.max_selections,
      display_order: payload.display_order,
    }),
);

export const deleteAddonGroup = createApiThunk('menuManagement/deleteAddonGroup', (id: number) => axiosInstance.delete(`/addon-group/${id}`));

/* ===================== ADDON THUNKS ===================== */

export const getAddons = createApiThunk('menuManagement/getAddons', () => axiosInstance.get('/addon'));

export const addAddon = createApiThunk('menuManagement/addAddon', (payload: { restaurant: number; addon_group: number; name: string; price: number; description: string }) =>
  axiosInstance.post('/addon', payload),
);

export const updateAddon = createApiThunk(
  'menuManagement/updateAddon',
  (payload: { id: number; restaurant: number; addon_group: number; name: string; price: number; description: string }) =>
    axiosInstance.patch(`/addon/${payload.id}`, {
      restaurant: payload.restaurant,
      addon_group: payload.addon_group,
      name: payload.name,
      price: payload.price,
      description: payload.description,
    }),
);

export const deleteAddon = createApiThunk('menuManagement/deleteAddon', (id: number) => axiosInstance.delete(`/addon/${id}`));

/* ===================== MENU ITEM ADDON THUNKS ===================== */

export const getMenuItemAddons = createApiThunk('menuManagement/getMenuItemAddons', (menuItemId: number) => axiosInstance.get(`/menu-item-addon?menu_item=${menuItemId}`));

export const assignAddonToMenuItem = createApiThunk('menuManagement/assignAddonToMenuItem', (payload: { menu_item: number; addon_group: number }) =>
  axiosInstance.post(`/menu-item-addon/${payload.menu_item}`, { menu_item: payload.menu_item, addon_group: payload.addon_group }),
);

export const unassignAddonFromMenuItem = createApiThunk('menuManagement/unassignAddonFromMenuItem', (id: number) => axiosInstance.delete(`/menu-item-addon/${id}`));

/* ===================== MODIFIER GROUP THUNKS ===================== */

export const getModifierGroups = createApiThunk('menuManagement/getModifierGroups', () => axiosInstance.get('/modifier-group'));

export const addModifierGroup = createApiThunk(
  'menuManagement/addModifierGroup',
  (payload: { name: string; description: string; selection_type: string; min_selections: number; max_selections: number; display_order: number }) =>
    axiosInstance.post('/modifier-group', payload),
);

export const updateModifierGroup = createApiThunk(
  'menuManagement/updateModifierGroup',
  (payload: { id: number; name: string; description: string; selection_type: string; min_selections: number; max_selections: number; display_order: number }) =>
    axiosInstance.patch(`/modifier-group/${payload.id}`, {
      name: payload.name,
      description: payload.description,
      selection_type: payload.selection_type,
      min_selections: payload.min_selections,
      max_selections: payload.max_selections,
      display_order: payload.display_order,
    }),
);

export const deleteModifierGroup = createApiThunk('menuManagement/deleteModifierGroup', (id: number) => axiosInstance.delete(`/modifier-group/${id}`));

/* ===================== MODIFIER THUNKS ===================== */

export const getModifiers = createApiThunk('menuManagement/getModifiers', () => axiosInstance.get('/modifier'));

export const addModifier = createApiThunk(
  'menuManagement/addModifier',
  (payload: { modifier_group: number; name: string; description: string; price: number; is_available: boolean; is_default: boolean; display_order: number }) =>
    axiosInstance.post('/modifier', payload),
);

export const updateModifier = createApiThunk(
  'menuManagement/updateModifier',
  (payload: { id: number; modifier_group: number; name: string; description: string; price: number; is_available: boolean; is_default: boolean; display_order: number }) =>
    axiosInstance.patch(`/modifier/${payload.id}`, {
      modifier_group: payload.modifier_group,
      name: payload.name,
      description: payload.description,
      price: payload.price,
      is_available: payload.is_available,
      is_default: payload.is_default,
      display_order: payload.display_order,
    }),
);

export const deleteModifier = createApiThunk('menuManagement/deleteModifier', (id: number) => axiosInstance.delete(`/modifier/${id}`));

/* ===================== MENU ITEM MODIFIER GROUP THUNKS ===================== */

export const getMenuItemModifierGroups = createApiThunk('menuManagement/getMenuItemModifierGroups', (menuItemId: number) =>
  axiosInstance.get(`/menu-item-modifier-group?menu_item=${menuItemId}`),
);

export const assignModifierGroupToMenuItem = createApiThunk(
  'menuManagement/assignModifierGroupToMenuItem',
  (payload: { menu_item: number; modifier_group: number; is_required: boolean; display_order: number; depends_on_variant?: number }) =>
    axiosInstance.post('/menu-item-modifier-group', payload),
);

export const updateMenuItemModifierGroup = createApiThunk(
  'menuManagement/updateMenuItemModifierGroup',
  (payload: { id: number; menu_item: number; modifier_group: number; is_required: boolean; display_order: number; depends_on_variant?: number }) =>
    axiosInstance.patch(`/menu-item-modifier-group/${payload.id}`, {
      menu_item: payload.menu_item,
      modifier_group: payload.modifier_group,
      is_required: payload.is_required,
      display_order: payload.display_order,
      depends_on_variant: payload.depends_on_variant,
    }),
);

export const unassignModifierGroupFromMenuItem = createApiThunk('menuManagement/unassignModifierGroupFromMenuItem', (id: number) =>
  axiosInstance.delete(`/menu-item-modifier-group/${id}`),
);

/* ===================== SLICE ===================== */

const menuManagementSlice = createSlice({
  name: 'menuManagement',
  initialState,
  reducers: {
    clearMenuManagementState: (state) => {
      state.error = null;
      state.success = null;
    },
    clearMenuManagementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* ---------- SPECIFIC SUCCESS CASES ---------- */

    builder.addCase(getCategories.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.categories = action.payload.data || [];
    });

    builder.addCase(getMenuItems.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.menuItems = action.payload.data || [];
    });

    builder.addCase(getVariationGroups.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.variationGroups = action.payload.data || [];
    });

    builder.addCase(getVariations.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.variations = action.payload.data || [];
    });

    builder.addCase(getMenuItemVariationGroups.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.menuItemVariationGroups = action.payload.data || [];
    });

    builder.addCase(getAddonGroups.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.addonGroups = action.payload.data || [];
    });

    builder.addCase(getAddons.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.addons = action.payload.data || [];
    });

    builder.addCase(getMenuItemAddons.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.menuItemAddons = action.payload.data || [];
    });

    builder.addCase(getModifierGroups.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.modifierGroups = action.payload.data || [];
    });

    builder.addCase(getModifiers.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.modifiers = action.payload.data || [];
    });

    builder.addCase(getMenuItemModifierGroups.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.menuItemModifierGroups = action.payload.data || [];
    });

    builder.addMatcher(isAnyOf(getAllSubCategories.fulfilled), (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.subCategories = action.payload.data || [];
    });

    /* ---------- GLOBAL PENDING ---------- */

    builder.addMatcher(
      (action) => action.type.startsWith('menuManagement') && action.type.endsWith('/pending'),
      (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      },
    );

    /* ---------- GLOBAL REJECTED ---------- */

    builder.addMatcher(
      (action) => action.type.startsWith('menuManagement') && action.type.endsWith('/rejected'),
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload || 'Something went wrong';
        state.success = false;
      },
    );

    /* ---------- CREATE / UPDATE / DELETE SUCCESS ---------- */

    builder.addMatcher(
      isAnyOf(
        addCategory.fulfilled,
        updateCategory.fulfilled,
        deleteCategory.fulfilled,
        addSubCategory.fulfilled,
        updateSubCategory.fulfilled,
        deleteSubCategory.fulfilled,
        addMenuItem.fulfilled,
        updateMenuItem.fulfilled,
        deleteMenuItem.fulfilled,
        getMenuItemById.fulfilled,
        addVariationGroup.fulfilled,
        updateVariationGroup.fulfilled,
        deleteVariationGroup.fulfilled,
        addVariation.fulfilled,
        updateVariation.fulfilled,
        deleteVariation.fulfilled,
        assignVariationGroupToMenuItem.fulfilled,
        updateMenuItemVariationGroup.fulfilled,
        unassignVariationGroupFromMenuItem.fulfilled,
        addAddonGroup.fulfilled,
        updateAddonGroup.fulfilled,
        deleteAddonGroup.fulfilled,
        addAddon.fulfilled,
        updateAddon.fulfilled,
        deleteAddon.fulfilled,
        assignAddonToMenuItem.fulfilled,
        unassignAddonFromMenuItem.fulfilled,
        addModifierGroup.fulfilled,
        updateModifierGroup.fulfilled,
        deleteModifierGroup.fulfilled,
        addModifier.fulfilled,
        updateModifier.fulfilled,
        deleteModifier.fulfilled,
        assignModifierGroupToMenuItem.fulfilled,
        updateMenuItemModifierGroup.fulfilled,
        unassignModifierGroupFromMenuItem.fulfilled,
      ),
      (state) => {
        state.isLoading = false;
        state.success = true;
      },
    );
  },
});

/* ===================== EXPORT ===================== */

export const { clearMenuManagementState, clearMenuManagementError } = menuManagementSlice.actions;

export default menuManagementSlice.reducer;
