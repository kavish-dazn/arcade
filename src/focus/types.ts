import type { ReactNode } from 'react';

export type FocusDirection = 'left' | 'right' | 'up' | 'down';

export type FocusableNeighbours = Partial<Record<FocusDirection, string>>;

export interface FocusableOptions extends FocusableNeighbours {
    id: string;
    initialFocus?: boolean;
    disabled?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    onSelect?: () => void;
}

export interface FocusableProps extends FocusableOptions {
    children: ReactNode;
    className?: string;
}
