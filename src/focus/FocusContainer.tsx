import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    type CSSProperties,
    type MutableRefObject,
    type ReactNode,
} from 'react';
import classNames from 'classnames';

import type { FocusDirection, FocusableOptions } from './types';

type ContainerType = 'vertical' | 'horizontal' | 'grid';

interface FocusContainerValue {
    getNextId: (id: string, direction: FocusDirection) => string | undefined;
    registerFocusable: (optionsRef: MutableRefObject<FocusableOptions>) => () => void;
}

interface FocusContainerProps {
    children: ReactNode;
    className?: string;
    loop?: boolean;
}

interface GridProps extends FocusContainerProps {
    columns: number;
}

export const FocusContainerContext = createContext<FocusContainerValue | null>(null);

function getNextIndex(index: number, length: number, step: number, loop: boolean) {
    const nextIndex = index + step;

    if (nextIndex >= 0 && nextIndex < length) {
        return nextIndex;
    }

    return loop ? (nextIndex + length) % length : undefined;
}

function FocusContainer({ children, className, loop = false, type, columns = 1 }: FocusContainerProps & {
    type: ContainerType;
    columns?: number;
}) {
    const itemsRef = useRef(new Map<symbol, MutableRefObject<FocusableOptions>>());

    const registerFocusable = useCallback((optionsRef: MutableRefObject<FocusableOptions>) => {
        const key = Symbol('focusable');
        itemsRef.current.set(key, optionsRef);

        return () => {
            itemsRef.current.delete(key);
        };
    }, []);

    const getNextId = useCallback((id: string, direction: FocusDirection) => {
        const items = [...itemsRef.current.values()];
        const index = items.findIndex((item) => item.current.id === id);

        if (index === -1) {
            return undefined;
        }

        let nextIndex: number | undefined;

        if (type === 'vertical' && (direction === 'up' || direction === 'down')) {
            nextIndex = getNextIndex(index, items.length, direction === 'up' ? -1 : 1, loop);
        }

        if (type === 'horizontal' && (direction === 'left' || direction === 'right')) {
            nextIndex = getNextIndex(index, items.length, direction === 'left' ? -1 : 1, loop);
        }

        if (type === 'grid') {
            const row = Math.floor(index / columns);
            const column = index % columns;

            if (direction === 'left' || direction === 'right') {
                const rowStart = row * columns;
                const rowEnd = Math.min(rowStart + columns, items.length) - 1;
                nextIndex = direction === 'left'
                    ? (index > rowStart ? index - 1 : loop ? rowEnd : undefined)
                    : (index < rowEnd ? index + 1 : loop ? rowStart : undefined);
            }

            if (direction === 'up' || direction === 'down') {
                const candidate = direction === 'up' ? index - columns : index + columns;

                if (candidate >= 0 && candidate < items.length) {
                    nextIndex = candidate;
                } else if (loop) {
                    const rows = Math.ceil(items.length / columns);
                    const loopedRow = direction === 'up' ? rows - 1 : 0;
                    const loopedIndex = loopedRow * columns + column;
                    nextIndex = loopedIndex < items.length ? loopedIndex : undefined;
                }
            }
        }

        return nextIndex === undefined ? undefined : items[nextIndex]?.current.id;
    }, [columns, loop, type]);

    const value = useMemo(() => ({ getNextId, registerFocusable }), [getNextId, registerFocusable]);
    const style = type === 'grid'
        ? { '--focus-grid-columns': columns } as CSSProperties
        : undefined;

    return (
        <FocusContainerContext.Provider value={value}>
            <div className={classNames('focus-container', `focus-container--${type}`, className)} style={style}>
                {children}
            </div>
        </FocusContainerContext.Provider>
    );
}

export function VerticalList(props: FocusContainerProps) {
    return <FocusContainer {...props} type="vertical" />;
}

export function HorizontalList(props: FocusContainerProps) {
    return <FocusContainer {...props} type="horizontal" />;
}

export function Grid({ columns, ...props }: GridProps) {
    if (!Number.isInteger(columns) || columns < 1) {
        throw new Error('Grid requires a positive integer number of columns.');
    }

    return <FocusContainer {...props} columns={columns} type="grid" />;
}

export function useFocusContainer() {
    return useContext(FocusContainerContext);
}
