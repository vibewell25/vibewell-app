import 'react';

declare module 'react' {
  // Re-export all the original React types
  export * from 'react/index';
  
  // Add useState and other hooks explicitly
  export const useState: <T>(initialState: T | (() => T)) => [T, (state: T | ((prevState: T) => T)) => void];
  export const useEffect: (effect: () => void | (() => void), deps?: ReadonlyArray<any>) => void;
  export const useCallback: <T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>) => T;
  export const useMemo: <T>(factory: () => T, deps: ReadonlyArray<any>) => T;
  export const useRef: <T>(initialValue: T) => { current: T };
  export const useContext: <T>(context: React.Context<T>) => T;
  export const useReducer: <R extends React.Reducer<any, any>>(
    reducer: R,
    initialState: React.ReducerState<R>,
    initializer?: (arg: React.ReducerState<R>) => React.ReducerState<R>
  ) => [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
}

// Ensure JSX namespace is defined
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
} 