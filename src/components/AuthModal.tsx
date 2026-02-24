import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register, loginWithGoogle } = useAuth();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const reset = () => {
    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setError('');
    setIsLoading(false);
    setShowPassword(false);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const success = await login(loginData.email.trim(), loginData.password);
    setIsLoading(false);
    if (!success) {
      setError('Email or password is incorrect.');
      return;
    }
    reset();
    onClose();
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (registerData.password !== registerData.confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }
    setIsLoading(true);
    const success = await register(
      registerData.name.trim(),
      registerData.email.trim(),
      registerData.phone.trim() || undefined,
      registerData.password
    );
    setIsLoading(false);
    if (!success) {
      setError('Registration failed. Please try again.');
      return;
    }
    reset();
    onClose();
  };

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    const success = await loginWithGoogle();
    setIsLoading(false);
    if (!success) {
      setError('Google sign-in failed.');
      return;
    }
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[960px] p-0 overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-700">
        <div className="grid md:grid-cols-2">
          <div className="hidden md:flex relative bg-gradient-to-br from-primary to-primary-dark p-10">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-28 h-28 bg-white/20 rounded-full blur-2xl" />
              <div className="absolute bottom-16 right-8 w-36 h-36 bg-secondary/25 rounded-full blur-2xl" />
            </div>
            <div className="relative h-full text-white flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 font-bold">P</div>
                <h3 className="text-3xl font-bold mb-2">Welcome to Panahyar</h3>
                <p className="text-white/85">Modern onboarding for migration services with faster support.</p>
              </div>
              <div className="space-y-3 text-sm">
                <p>Free consultation</p>
                <p>24/7 assistance</p>
                <p>Step-by-step progress tracking</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-center dark:text-white">
                {activeTab === 'login' ? 'Sign in' : 'Create account'}
              </DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {error && <div className="mb-4 rounded-xl bg-error/10 text-error px-3 py-2 text-sm text-center">{error}</div>}

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                disabled={isLoading}
                className="w-full mb-5 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Continue with Google
              </Button>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pr-10 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="********"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pr-10 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Admin demo: admin@panahyar.com / 123456
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full name</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Full name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="pr-10 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="pr-10 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Phone (optional)</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+1 234 567 890"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        className="pr-10 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="********"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="pr-10 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm password</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-confirm"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="********"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="pr-10 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
