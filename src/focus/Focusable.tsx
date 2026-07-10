import classNames from 'classnames';

import { useFocusable } from './useFocusable';
import type { FocusableProps } from './types';
import './styles.scss';

export function Focusable({ children, className, ...options }: FocusableProps) {
    const { isFocused } = useFocusable(options);

    return (
        <div className={classNames('focus-button', className, { focused: isFocused, disabled: options.disabled })}>
            {children}
        </div>
    );
}
