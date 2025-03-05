import * as React from 'react';
import {KeyboardAvoidingView, Platform,} from 'react-native';

type AvoidingViewProps = {
    children: React.ReactNode;
};

const InputKeyboardView = ({children}: AvoidingViewProps) => {
    return Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={'height'}
            keyboardVerticalOffset={150}

        >
            {children}
        </KeyboardAvoidingView>
    ) : (
        <>{children}</>
    );
};

export default InputKeyboardView;
