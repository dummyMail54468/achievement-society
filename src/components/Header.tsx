
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Search, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-6">
            <h1 className="text-xl font-bold achievement-gradient text-transparent bg-clip-text">
              Achievement Society
            </h1>
          </Link>
          
          {!isMobile && (
            <div className="hidden md:flex space-x-1">
              <Link to="/">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Home className="w-5 h-5 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/search">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Search className="w-5 h-5 mr-2" />
                  Discover
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {user ? (
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <Link to="/achievement/new">
                <Button variant="default" size="sm" className="rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Achievement
                </Button>
              </Link>
            )}
            
            <Link to="/notifications" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell className="w-5 h-5" />
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePicture} alt={user.fullName} />
                    <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${user.username}`} className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {isMobile && (
                    <DropdownMenuItem asChild>
                      <Link to="/achievement/new" className="w-full cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Post Achievement</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={toggleMenu} className="md:hidden">
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-3 px-4 border-t">
          <nav className="flex flex-col space-y-2">
            <Link to="/" onClick={closeMenu} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <Home className="w-5 h-5 mr-3" />
              <span>Home</span>
            </Link>
            <Link to="/search" onClick={closeMenu} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <Search className="w-5 h-5 mr-3" />
              <span>Discover</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
