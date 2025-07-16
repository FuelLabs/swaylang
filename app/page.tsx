"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Code,
  Zap,
  Shield,
  Package,
  BookOpen,
  ExternalLink,
  Github,
  Twitter,
  ChevronRight,
  Sparkles,
  Layers,
  Settings,
  Copy,
} from "lucide-react"
import Link from "next/link"

export default function SwayWebsite() {
  const contractExamples = {
    counter: `contract Counter {
    storage {
        count: u64 = 0,
    }

    abi Counter {
        #[storage(read, write)]
        fn increment() -> u64;
        
        #[storage(read)]
        fn get_count() -> u64;
    }

    impl Counter for Contract {
        #[storage(read, write)]
        fn increment() -> u64 {
            storage.count.write(storage.count.read() + 1);
            storage.count.read()
        }

        #[storage(read)]
        fn get_count() -> u64 {
            storage.count.read()
        }
    }
}`,
    singleAssetSrc20: `contract SingleAssetToken {
    storage {
        total_supply: u64 = 0,
        name: str[32] = __to_str_array("MyToken"),
        symbol: str[8] = __to_str_array("MTK"),
        decimals: u8 = 9,
    }

    abi SRC20 {
        #[storage(read)]
        fn total_supply() -> u64;
        
        #[storage(read)]
        fn name() -> str[32];
        
        #[storage(read)]
        fn symbol() -> str[8];
        
        #[storage(read)]
        fn decimals() -> u8;
        
        #[storage(read, write)]
        fn mint(recipient: Identity, amount: u64);
    }

    impl SRC20 for Contract {
        #[storage(read)]
        fn total_supply() -> u64 {
            storage.total_supply.read()
        }

        #[storage(read)]
        fn name() -> str[32] {
            storage.name.read()
        }

        #[storage(read)]
        fn symbol() -> str[8] {
            storage.symbol.read()
        }

        #[storage(read)]
        fn decimals() -> u8 {
            storage.decimals.read()
        }

        #[storage(read, write)]
        fn mint(recipient: Identity, amount: u64) {
            storage.total_supply.write(storage.total_supply.read() + amount);
            // Mint logic here
        }
    }
}`,
    multiAssetSrc20: `contract MultiAssetToken {
    storage {
        total_assets: u64 = 0,
        total_supply: StorageMap<AssetId, u64> = StorageMap {},
        name: StorageMap<AssetId, str[32]> = StorageMap {},
        symbol: StorageMap<AssetId, str[8]> = StorageMap {},
        decimals: StorageMap<AssetId, u8> = StorageMap {},
    }

    abi SRC20 {
        #[storage(read)]
        fn total_supply(asset: AssetId) -> Option<u64>;
        
        #[storage(read)]
        fn name(asset: AssetId) -> Option<str[32]>;
        
        #[storage(read)]
        fn symbol(asset: AssetId) -> Option<str[8]>;
        
        #[storage(read)]
        fn decimals(asset: AssetId) -> Option<u8>;
        
        #[storage(read, write)]
        fn mint(recipient: Identity, asset: AssetId, amount: u64);
    }

    impl SRC20 for Contract {
        #[storage(read)]
        fn total_supply(asset: AssetId) -> Option<u64> {
            storage.total_supply.get(asset).try_read()
        }

        #[storage(read)]
        fn name(asset: AssetId) -> Option<str[32]> {
            storage.name.get(asset).try_read()
        }

        #[storage(read)]
        fn symbol(asset: AssetId) -> Option<str[8]> {
            storage.symbol.get(asset).try_read()
        }

        #[storage(read)]
        fn decimals(asset: AssetId) -> Option<u8> {
            storage.decimals.get(asset).try_read()
        }

        #[storage(read, write)]
        fn mint(recipient: Identity, asset: AssetId, amount: u64) {
            let current_supply = storage.total_supply.get(asset).try_read().unwrap_or(0);
            storage.total_supply.insert(asset, current_supply + amount);
            // Mint logic here
        }
    }
}`,
  }

  const [selectedContract, setSelectedContract] = useState<keyof typeof contractExamples>("counter")
  const [code, setCode] = useState(contractExamples.counter)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCode(contractExamples[selectedContract])
  }, [selectedContract])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-cyan-100 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌴</span>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Sway
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#language" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Language
              </Link>
              <Link href="#forc" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Forc
              </Link>
              <Link href="#libraries" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Libraries
              </Link>
              <Link href="#standards" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Standards
              </Link>
              <Link href="#registry" className="text-gray-700 hover:text-emerald-600 transition-colors">
                Registry
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent"></div>
        <svg
          className="absolute bottom-0 left-0 right-0"
          viewBox="0 0 1200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="rgba(16, 185, 129, 0.1)" />
        </svg>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🌴</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Sway
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Smart Contract Language of the future. ☀️
              <br />
              Safe, fast, and expressive - inspired by Rust.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              asChild
            >
              <Link href="https://docs.fuel.network/docs/sway/" target="_blank" rel="noopener noreferrer">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-emerald-200 hover:bg-emerald-50 bg-transparent">
              <Code className="mr-2 h-4 w-4" />
              View Examples
            </Button>
          </div>

          {/* Interactive Code Editor */}
          <Card className="max-w-2xl mx-auto bg-gray-900 border-gray-700 relative">
            <CardContent className="p-0">
              {/* Header with dropdown */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <Select
                  value={selectedContract}
                  onValueChange={(value: keyof typeof contractExamples) => setSelectedContract(value)}
                >
                  <SelectTrigger className="w-64 bg-gray-800 border-gray-600 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="counter" className="text-gray-300 hover:bg-gray-700">
                      Counter Contract
                    </SelectItem>
                    <SelectItem value="singleAssetSrc20" className="text-gray-300 hover:bg-gray-700">
                      Single Asset SRC20
                    </SelectItem>
                    <SelectItem value="multiAssetSrc20" className="text-gray-300 hover:bg-gray-700">
                      Multi Asset SRC20
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Copy button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>

              {/* Code editor area */}
              <div className="relative">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 p-6 bg-gray-900 text-gray-300 font-mono text-sm resize-none border-none outline-none overflow-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-emerald-600 hover:scrollbar-thumb-emerald-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                  style={{
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    scrollbarWidth: "thin",
                    scrollbarColor: "#059669 #1f2937",
                  }}
                  spellCheck={false}
                />
                <style jsx>{`
                  textarea::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                  }
                  
                  textarea::-webkit-scrollbar-track {
                    background: #1f2937;
                    border-radius: 10px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                  }
                  
                  textarea::-webkit-scrollbar-thumb {
                    background: linear-gradient(45deg, #059669, #0d9488);
                    border-radius: 10px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                  }
                  
                  textarea:hover::-webkit-scrollbar-track,
                  textarea:focus::-webkit-scrollbar-track {
                    opacity: 1;
                  }
                  
                  textarea:hover::-webkit-scrollbar-thumb,
                  textarea:focus::-webkit-scrollbar-thumb {
                    opacity: 1;
                  }
                  
                  textarea::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(45deg, #047857, #0f766e);
                  }
                `}</style>
              </div>

              {/* Deploy button */}
              <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  asChild
                >
                  <Link href="https://www.sway-playground.org/" target="_blank" rel="noopener noreferrer">
                    <span className="mr-2">🏄‍♂️</span>
                    Deploy with Sway Playground
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Playground & Charcoal Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-20">🏖️</div>
        <div className="absolute bottom-0 left-0 text-4xl opacity-20">🌊</div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">🏖️ Dive Right In</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start building with Sway instantly in your browser, or migrate from Solidity with zero friction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-cyan-200 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏄‍♂️</span>
                  <CardTitle className="text-2xl">Sway Playground</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  A full-featured browser IDE where you can write, deploy, and interact with Sway contracts instantly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Write and edit Sway code with syntax highlighting
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    Deploy contracts to testnet with one click
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                    Interact with deployed contracts directly
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Share your projects with the community
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  asChild
                >
                  <Link href="https://www.sway-playground.org/" target="_blank" rel="noopener noreferrer">
                    <span className="mr-2">🏄‍♂️</span>
                    Launch Playground
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🔄</span>
                  <CardTitle className="text-2xl">Charcoal Transpiler</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Seamlessly migrate your Solidity contracts to Sway with our intelligent transpiler.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Automatic Solidity to Sway conversion
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Preserves contract logic and structure
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Integrated into Sway Playground
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Reduces migration friction significantly
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 mb-4">
                  <code className="text-orange-400 text-xs">// Paste your Solidity code → Get Sway output ✨</code>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-orange-200 hover:bg-orange-50 bg-transparent"
                  asChild
                >
                  <Link href="https://github.com/ourovoros-io/charcoal" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-cyan-200">
              <span className="text-sm text-gray-600">
                💡 Pro tip: The Sway Playground uses Charcoal behind the scenes for Solidity imports!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section id="language" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">🌴 The Sway Language</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rust-inspired syntax meets blockchain efficiency. Write smart contracts that are both safe and performant.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle>Memory Safe</CardTitle>
                <CardDescription>
                  Built-in memory safety without garbage collection, inspired by Rust's ownership model.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-teal-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-8 w-8 text-teal-600 mb-2" />
                <CardTitle>High Performance</CardTitle>
                <CardDescription>
                  Optimized for the Fuel VM with zero-cost abstractions and efficient execution.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-cyan-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Sparkles className="h-8 w-8 text-cyan-600 mb-2" />
                <CardTitle>Developer Friendly</CardTitle>
                <CardDescription>
                  Familiar Rust-like syntax with powerful tooling and comprehensive error messages.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" variant="outline" className="border-emerald-200 hover:bg-emerald-50 bg-transparent">
              <BookOpen className="mr-2 h-4 w-4" />
              Read the Sway Book
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Forc Section */}
      <section id="forc" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">⚡ Forc Toolchain</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The complete toolkit for Sway development. Build, test, and deploy with ease.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-amber-200">
              <CardHeader>
                <Settings className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Build System</CardTitle>
                <CardDescription className="mb-4">
                  Cargo-inspired build system with dependency management and workspace support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4">
                  <code className="text-green-400 text-sm">
                    $ forc new my-contract
                    <br />$ forc build
                    <br />$ forc test
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader>
                <Layers className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Development Tools</CardTitle>
                <CardDescription className="mb-4">
                  Integrated testing, formatting, and deployment tools for a smooth developer experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">forc fmt</Badge>
                  <Badge variant="secondary">forc test</Badge>
                  <Badge variant="secondary">forc deploy</Badge>
                  <Badge variant="secondary">forc doc</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Libraries Section */}
      <section id="libraries" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">📚 Sway Libraries</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A growing ecosystem of reusable libraries to accelerate your development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "sway-std", description: "Standard library with core utilities", downloads: "12.5k" },
              { name: "sway-libs", description: "Common patterns and data structures", downloads: "8.2k" },
              { name: "asset-lib", description: "Asset management utilities", downloads: "5.1k" },
              { name: "access-control", description: "Permission and role management", downloads: "4.8k" },
              { name: "merkle-proof", description: "Merkle tree verification", downloads: "3.2k" },
              { name: "oracle-lib", description: "Oracle integration helpers", downloads: "2.9k" },
            ].map((lib, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{lib.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {lib.downloads}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{lib.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Section */}
      <section id="standards" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">📋 Sway Standards</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Community-driven standards for interoperability and best practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  SRC Standards
                </CardTitle>
                <CardDescription>
                  Sway Request for Comments - defining token standards, interfaces, and protocols.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">SRC-20</span>
                    <Badge>Fungible Tokens</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">SRC-721</span>
                    <Badge>Non-Fungible Tokens</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">SRC-1155</span>
                    <Badge>Multi-Token</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  Style Guide
                </CardTitle>
                <CardDescription>
                  Coding conventions and best practices for writing clean, maintainable Sway code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">• Naming conventions</div>
                  <div className="text-sm text-gray-600">• Code organization</div>
                  <div className="text-sm text-gray-600">• Documentation standards</div>
                  <div className="text-sm text-gray-600">• Security best practices</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registry Section */}
      <section id="registry" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">📦 Sway Registry</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              forc.pub - The central registry for Sway packages and libraries.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto border-emerald-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">forc.pub</CardTitle>
              <CardDescription className="text-lg">
                Discover, share, and manage Sway packages with the community.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">📥 Install Packages</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <code className="text-green-400 text-sm">
                      forc add sway-libs --git https://github.com/FuelLabs/sway-libs
                    </code>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">📤 Publish Packages</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <code className="text-green-400 text-sm">forc publish</code>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit forc.pub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🌴</span>
                <span className="text-xl font-bold">Sway</span>
              </div>
              <p className="text-gray-400">A chill smart contract language for the Fuel ecosystem. 🏖️</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Language</h3>
              <div className="space-y-2 text-gray-400">
                <div>Documentation</div>
                <div>Examples</div>
                <div>Playground</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Tools</h3>
              <div className="space-y-2 text-gray-400">
                <div>Forc CLI</div>
                <div>VS Code Extension</div>
                <div>forc.pub Registry</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <div className="space-y-2 text-gray-400">
                <div>GitHub</div>
                <div>Twitter</div>
                <div>Discord</div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
            <div>© 2024 Sway Language. Part of the Fuel ecosystem.</div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span>Built with 🌴 and ❤️</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
