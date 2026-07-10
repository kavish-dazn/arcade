import { useContext, useEffect, useRef } from 'react';

import { FocusContext } from './FocusProvider';
import { FocusScopeContext } from './FocusScope';
import type { FocusableOptions } from './types';

export function useFocusable(options: FocusableOptions) {
    const context = useContext(FocusContext);
    const scopeId = useContext(FocusScopeContext);

    if (!context) {
        throw new Error('useFocusable must be used inside a FocusProvider.');
    }

    if (!scopeId) {
        throw new Error('useFocusable must be used inside a FocusScope.');
    }

    const { activeScopeId, focusedId, registerFocusable } = context;
    const optionsRef = useRef(options);
    optionsRef.current = options;

    useEffect(() => registerFocusable(scopeId, optionsRef), [options.id, registerFocusable, scopeId]);

    return {
        isFocused: activeScopeId === scopeId && focusedId === options.id,
    };
}
