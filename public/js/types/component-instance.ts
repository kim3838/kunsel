
import type {CompanyUserSelectionT} from "@/public/js/types/user";

export interface SingleSelectPaginatedInstance {
    pending: boolean;
}

export interface MultiSelectPaginatedInstance {
    pending: boolean;
    clearSelected: () => void;
}

export interface ShiftAssignmentsInstance {
    paginate: (page?: number, clearSelection?: boolean) => Promise<void>;
}

export interface UserSelectionInstance {
    clearFlags: () => void;
    clearData: () => void;
    paginate: (page?: number, clearSelection?: boolean) => Promise<void>;
    reset: () => void;
    getSelectedData: () => CompanyUserSelectionT[];
}

export interface EmployeeSelectionInstance {
    clearFlags: () => void;
    clearData: () => void;
    paginate: (page?: number, clearSelection?: boolean) => Promise<void>;
    reset: () => void;
    rebuildSelections: (selection?: string[]) => void;
}

export interface ShiftSelectionInstance {
    paginate: (page?: number, clearSelection?: boolean) => Promise<void>;
}

export interface ShiftByEmployeeSelectionInstance {
    clearFlags: () => void;
    clearData: () => void;
    paginate: (page?: number, clearSelection?: boolean) => Promise<void>;
    reset: () => void;
}

export interface LeaveTypeAssignmentsInstance {
    paginate: (page?: number, clearSelection?: boolean) => Promise<void>;
}

export interface LeaveTypeSelectionInstance {
    paginate: (page?: number, clearSelection?: boolean) => Promise<void>;
}

export interface LeaveTypeByEmployeeSelectionInstance {
    clearFlags: () => void;
    clearData: () => void;
    paginate: (page?: number, clearSelection?: boolean) => Promise<void>;
    reset: () => void;
}