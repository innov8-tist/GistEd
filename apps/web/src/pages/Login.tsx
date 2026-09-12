
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Github, Mail, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Mock credentials
        if (email === "demo@gisted.com" && password === "demo123") {
            // Store mock user data matching the User type
            localStorage.setItem("mockUser", JSON.stringify({
                email: "demo@gisted.com",
                id: "demo-user-001",
                name: "Demo User",
                pwd: null,
                provider: "google" as const,
                providerid: "demo-provider-001",
                pfp: null,
                isDemoMode: true
            }));
            navigate("/chat");
        } else {
            setError("Invalid credentials. Use: demo@gisted.com / demo123");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Login to GistEd</h1>
                    <p className="text-gray-500">Enter your credentials to continue</p>
                </CardHeader>
                <CardContent>
                    <Alert className="mb-4 bg-blue-50 border-blue-200">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-sm text-blue-800">
                            <strong>Demo Mode:</strong> Email: <code className="bg-blue-100 px-1 rounded">demo@gisted.com</code> | Password: <code className="bg-blue-100 px-1 rounded">demo123</code>
                        </AlertDescription>
                    </Alert>
                    {error && (
                        <Alert className="mb-4 bg-red-50 border-red-200">
                            <AlertDescription className="text-sm text-red-800">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="text-right">
                                <a href="#" className="text-sm text-blue-600 hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            Login
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={() => {
                                alert("OAuth login requires backend server. Please use demo credentials for now.");
                            }}
                            variant="outline" className="w-full" type="button">
                            <Github
                                className="mr-2 h-4 w-4" />
                            Github
                        </Button>
                        <Button
                            onClick={() => {
                                alert("OAuth login requires backend server. Please use demo credentials for now.");
                            }}
                            variant="outline" className="w-full" type="button">
                            <Mail className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Sign Up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
