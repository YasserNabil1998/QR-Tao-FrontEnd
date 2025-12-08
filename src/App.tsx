import { BrowserRouter } from "react-router-dom";
import { Suspense, useState } from "react";
import { AppRoutes } from "./router/index";
import { AuthProvider } from "./components/auth/AuthProvider";
import Loader from "./components/common/Loader";
import SplashScreen from "./components/common/SplashScreen";

function App() {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <>
            {showSplash && (
                <SplashScreen
                    onFinish={() => setShowSplash(false)}
                    minDisplayTime={2000}
                />
            )}
            <BrowserRouter basename={__BASE_PATH__}>
                <AuthProvider>
                    <Suspense
                        fallback={
                            <Loader
                                fullScreen
                                size="xl"
                                variant="spinner"
                                text="جاري التحميل..."
                            />
                        }
                    >
                        <AppRoutes />
                    </Suspense>
                </AuthProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
