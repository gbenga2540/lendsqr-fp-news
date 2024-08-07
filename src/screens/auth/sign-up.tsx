import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { ActivityIndicator, TextStyle } from 'react-native';
import { fonts } from 'src/assets/fonts/fonts';
import {
  Button,
  Divider,
  Icon,
  Screen,
  Text,
  TextField,
  View,
} from 'src/components';
import { useCustomTheme } from 'src/context/theme/interfaces';
import { RegisterUserRequest, SignInUserWithGoogle } from 'src/domain/auth';
import { errorToast, successToast } from 'src/helpers';
import { logCrashlystics } from 'src/utils/crashlytics-handler';
import validator from 'validator';

const SignUpScreen: FunctionComponent = (): React.JSX.Element => {
  const navigation = useNavigation();
  const { colors } = useCustomTheme();
  const [isSignInLoading, setIsSignInLoading] = useState<boolean>(false);

  const [registerData, setRegisterData] = useState<RegisterUserRequest>({
    email: '',
    phoneNumber: '',
    fullName: '',
  });

  const handleInputChange = (key: keyof RegisterUserRequest, val: string) => {
    setRegisterData(prev => ({
      ...prev,
      [key]: val,
    }));
  };

  const registerUser = useCallback(() => {
    if (!validator.isEmail(registerData.email)) {
      logCrashlystics('User Entered an Invalid Email!');
      errorToast({
        message: 'Invalid Email!',
      });
      return;
    }

    if (validator.isEmpty(registerData.fullName)) {
      logCrashlystics('User did not input their name!');
      errorToast({
        message: 'Please input your name!',
      });
      return;
    }
    if (!validator.isMobilePhone(registerData.phoneNumber)) {
      logCrashlystics('User did not input a valid phone number!');
      errorToast({
        message: 'Please input a valid phone number!',
      });
      return;
    }

    logCrashlystics('User Registered successfully logic!');
    successToast({
      message: 'User Registered successfully logic!',
    });
    setRegisterData({
      email: '',
      fullName: '',
      phoneNumber: '',
    });
  }, [registerData]);

  const navToLoginScreen = () => {
    navigation.navigate('AuthStack', {
      screen: 'LoginScreen',
    });
  };

  const initGoogleSignUpUser = async () => {
    setTimeout(() => {
      setIsSignInLoading(true);
    }, 5000);
    await SignInUserWithGoogle();
    setIsSignInLoading(false);
  };

  if (isSignInLoading) {
    return (
      <Screen preset="fixed">
        <View flex={1} justifyContent="center" alignItems="center">
          <Text text="Signing In..." marginBottom={4} color={colors.linkText} />
          <ActivityIndicator color={colors.grayText} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen preset="scroll">
      <Text
        text="Let's get you started!"
        marginTop={40}
        marginBottom={25}
        fontSize={28}
        fontFamily={fonts.primaryFont_700}
      />

      <Text
        text="Full Name"
        marginBottom={4}
        fontSize={15}
        fontFamily={fonts.primaryFont_500}
      />
      <TextField
        marginBottom={18}
        value={registerData.fullName}
        setValue={text => handleInputChange('fullName', text as string)}
        placeholder="Enter your full name"
      />

      <Text
        text="Phone Number"
        marginBottom={4}
        fontSize={15}
        fontFamily={fonts.primaryFont_500}
      />
      <TextField
        marginBottom={18}
        value={registerData.phoneNumber}
        setValue={text => handleInputChange('phoneNumber', text as string)}
        placeholder="Enter your phone number"
      />

      <Text
        text="Email"
        marginBottom={4}
        fontSize={15}
        fontFamily={fonts.primaryFont_500}
      />
      <TextField
        marginBottom={18}
        value={registerData.email}
        setValue={text => handleInputChange('email', text as string)}
        placeholder="Enter your email"
      />

      <Button
        text="Already have for an account?"
        preset="link"
        marginLeft={'auto'}
        marginTop={15}
        marginBottom={3}
        onPress={navToLoginScreen}
        textStyle={LINK_TEXT}
      />

      <Button
        text="Register"
        marginTop={8}
        onPress={registerUser}
        disabled={
          !(
            registerData.email &&
            registerData.fullName &&
            registerData.phoneNumber
          )
        }
      />

      <Divider marginTop={30} marginBottom={20} />

      <Button
        backgroundColor={colors.transparent}
        borderWidth={1}
        borderRadius={6}
        height={50}
        justifyContent="center"
        alignItems="center"
        onPress={initGoogleSignUpUser}
        borderColor={colors.inputBackground}
        flexDirection="row">
        <Icon name="google-logo" size={24} />
        <Text text="Sign up with Google" marginLeft={5} />
      </Button>
    </Screen>
  );
};

export default SignUpScreen;

const LINK_TEXT: TextStyle = {
  fontSize: 13,
};
