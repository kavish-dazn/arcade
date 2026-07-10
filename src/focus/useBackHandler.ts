import { useContext, useEffect } from 'react';

import { FocusContext } from './FocusProvider';
import { FocusScopeContext } from './FocusScope';

/**
 * Overrides the current scope's default Back behaviour while the component is mounted.
 */
export function useBackHandler(handler: () => void) {
    const context = useContext(FocusContext);
    const scopeId = useContext(FocusScopeContext);

    if (!context) {
        throw new Error('useBackHandler must be used inside a FocusProvider.');
    }

    if (!scopeId) {
        throw new Error('useBackHandler must be used inside a FocusScope.');
    }

    const { registerBackHandler } = context;
    useEffect(() => registerBackHandler(handler), [handler, registerBackHandler]);
}
