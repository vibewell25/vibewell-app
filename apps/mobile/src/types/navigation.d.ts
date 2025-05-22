declare module '@react-navigation/native' {
  export function useNavigation(): any;
  export function NavigationContainer(props: any): JSX.Element;
}

declare module '@react-navigation/native-stack' {
  export interface NativeStackNavigationProp<T> {}
}

declare module '@react-navigation/stack' {
  export function createStackNavigator(): any;
}

declare module '@react-navigation/bottom-tabs' {
  export function createBottomTabNavigator(): any;
} 