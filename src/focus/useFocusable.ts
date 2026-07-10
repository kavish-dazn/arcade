import { useContext, useEffect, useRef } from 'react';

import { FocusContext } from './FocusProvider';
import { useFocusContainer } from './FocusContainer';
import { FocusScopeContext } from './FocusScope';
import type { FocusableOptions } from './types';

export function useFocusable(options: FocusableOptions) {
    const context = useContext(FocusContext);
    const scopeId = useContext(FocusScopeContext);
    const container = useFocusContainer();

    if (!context) {
        throw new Error('useFocusable must be used inside a FocusProvider.');
    }

    if (!scopeId) {
        throw new Error('useFocusable must be used inside a FocusScope.');
    }

    const { activeScopeId, focusedId, registerFocusable } = context;
    const optionsRef = useRef(options);
    optionsRef.current = options;

    useEffect(() => {
        const unregisterFocusable = registerFocusable(scopeId, optionsRef, container?.getNextId);
        const unregisterContainerItem = container?.registerFocusable(optionsRef);

        return () => {
            unregisterFocusable();
            unregisterContainerItem?.();
        };
    }, [container, options.id, registerFocusable, scopeId]);

    return {
        isFocused: activeScopeId === scopeId && focusedId === options.id,
    };
}
