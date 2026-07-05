'use client'

import { Package, Search, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useUser, useClerk, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const router = useRouter()

  const [search, setSearch] = useState('')

  const cartCount = useSelector((state) => state.cart.total)

  const handleSearch = (e) => {
    e.preventDefault()
    router.push(`/shop?search=${search}`)
  }

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          <div className="flex items-center gap-2 shrink-0">
            <Image
              className="w-15 h-15 object-contain"
              src={assets.ayogba_icon}
              alt="Ayogba logo"
            />
            <Link
              href="/"
              className="relative text-4xl font-semibold text-slate-700 leading-none"
            >
            <span className="text-[#8B0000]">ay</span>
            ogba
            <span className="text-[#8B0000] text-5xl leading-0">.</span>

            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 py-0.5 rounded-full flex items-center gap-2 text-white bg-[#8B0000]">
              plus
            </p>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/">About</Link>
            <Link href="/">Contact</Link>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} className="text-slate-600" />

              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-slate-600"
            >
              <ShoppingCart size={18} />
              Cart

              <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">
                {cartCount}
              </button>
            </Link>

            {/* User/Login */}
            {!user ? (
              <button
                onClick={() => openSignIn()}
                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton afterSignOutUrl="/">
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="My Orders"
                    labelIcon={<Package size={16} />}
                    onClick={() => router.push('/orders')}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>

          {/* Mobile User Button */}
          <div className="sm:hidden">
            {user ? (
              <UserButton afterSignOutUrl="/">
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Cart"
                    labelIcon={<ShoppingCart size={16} />}
                    onClick={() => router.push('/cart')}
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <button
                onClick={() => openSignIn()}
                className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />
    </nav>
  )
}

export default Navbar