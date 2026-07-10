import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type MutableRefObject,
    type ReactNode,
} from 'react';

import type { FocusDirection, FocusableOptions } from './types';

interface RegisteredFocusable {
    scopeId: string;
    optionsRef: MutableRefObject<FocusableOptions>;
}

interface FocusContextValue {
    activeScopeId: string | null;
    focusedId: string | null;
    activateScope: (scopeId: string) => void;
    deactivateScope: (scopeId: string) => void;
    registerFocusable: (scopeId: string, optionsRef: MutableRefObject<FocusableOptions>) => () => void;
    registerBackHandler: (handler: () => void) => () => void;
}

export const FocusContext = createContext<FocusContextValue | null>(null);

function getFocusableKey(scopeId: string, id: string) {
    return `${scopeId}:${id}`;
}

export function FocusProvider({ children }: { children: ReactNode }) {
    const focusablesRef = useRef(new Map<string, RegisteredFocusable>());
    const backHandlersRef = useRef(new Map<symbol, () => void>());
    const activeScopeIdRef = useRef<string | null>(null);
    const previousFocusedKeyRef = useRef<string | null>(null);
    const [activeScopeId, setActiveScopeId] = useState<string | null>(null);
    const [focusedId, setFocusedId] = useState<string | null>(null);

    const focusInitialItem = useCallback((scopeId: string) => {
        const items = [...focusablesRef.current.values()]
            .filter((item) => item.scopeId === scopeId && !item.optionsRef.current.disabled);
        const initialItem = items.find((item) => item.optionsRef.current.initialFocus) ?? items[0];

        setFocusedId(initialItem?.optionsRef.current.id ?? null);
    }, []);

    const activateScope = useCallback((scopeId: string) => {
        activeScopeIdRef.current = scopeId;
        setActiveScopeId(scopeId);
        focusInitialItem(scopeId);
    }, [focusInitialItem]);

    const deactivateScope = useCallback((scopeId: string) => {
        if (activeScopeIdRef.current !== scopeId) {
            return;
        }

        activeScopeIdRef.current = null;
        setActiveScopeId(null);
        setFocusedId(null);
    }, []);

    const registerFocusable = useCallback((scopeId: string, optionsRef: MutableRefObject<FocusableOptions>) => {
        const key = getFocusableKey(scopeId, optionsRef.current.id);
        focusablesRef.current.set(key, { scopeId, optionsRef });

        return () => {
            focusablesRef.current.delete(key);
        };
    }, []);

    const registerBackHandler = useCallback((handler: () => void) => {
        const id = Symbol('back-handler');
        backHandlersRef.current.set(id, handler);

        return () => {
            backHandlersRef.current.delete(id);
        };
    }, []);

    const handleBack = useCallback(() => {
        const handlers = [...backHandlersRef.current.values()];
        handlers.at(-1)?.();
    }, []);

    const moveFocus = useCallback((direction: FocusDirection) => {
        if (!activeScopeId || !focusedId) {
            return;
        }

        const currentItem = focusablesRef.current.get(getFocusableKey(activeScopeId, focusedId));
        const nextId = currentItem?.optionsRef.current[direction];

        if (!nextId) {
            return;
        }

        const nextItem = focusablesRef.current.get(getFocusableKey(activeScopeId, nextId));

        if (nextItem && !nextItem.optionsRef.current.disabled) {
            setFocusedId(nextItem.optionsRef.current.id);
        }
    }, [activeScopeId, focusedId]);

    const selectFocusedItem = useCallback(() => {
        if (!activeScopeId || !focusedId) {
            return;
        }

        focusablesRef.current
            .get(getFocusableKey(activeScopeId, focusedId))
            ?.optionsRef.current.onSelect?.();
    }, [activeScopeId, focusedId]);

    useEffect(() => {
        if (activeScopeId && focusedId === null) {
            focusInitialItem(activeScopeId);
        }
    }, [activeScopeId, focusInitialItem, focusedId]);

    useEffect(() => {
        const focusedKey = activeScopeId && focusedId
            ? getFocusableKey(activeScopeId, focusedId)
            : null;

        if (previousFocusedKeyRef.current === focusedKey) {
            return;
        }

        if (previousFocusedKeyRef.current) {
            focusablesRef.current.get(previousFocusedKeyRef.current)?.optionsRef.current.onBlur?.();
        }

        if (focusedKey) {
            focusablesRef.current.get(focusedKey)?.optionsRef.current.onFocus?.();
        }

        previousFocusedKeyRef.current = focusedKey;
    }, [activeScopeId, focusedId]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const directions: Partial<Record<string, FocusDirection>> = {
                ArrowLeft: 'left',
                ArrowRight: 'right',
                ArrowUp: 'up',
                ArrowDown: 'down',
            };
            const direction = directions[event.key];

            if (direction) {
                event.preventDefault();
                moveFocus(direction);
                return;
            }

            if (event.key === 'Enter' || event.key === 'NumpadEnter') {
                event.preventDefault();
                selectFocusedItem();
                return;
            }

            if (['Back', 'Backspace', 'BrowserBack', 'Escape', 'GoBack'].includes(event.key)) {
                event.preventDefault();
                handleBack();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleBack, moveFocus, selectFocusedItem]);

    const value = useMemo(() => ({
        activeScopeId,
        focusedId,
        activateScope,
        deactivateScope,
        registerFocusable,
        registerBackHandler,
    }), [activeScopeId, activateScope, deactivateScope, focusedId, registerBackHandler, registerFocusable]);

    return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}
