"use client"

import { useState, useEffect } from "react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-rust"
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
  ChevronRight,
  Sparkles,
  Layers,
  Settings,
  Copy,
} from "lucide-react"
import Link from "next/link"

import { siGithub, siX } from "simple-icons"

export default function SwayWebsite() {
  const contractExamples = {
    counter: {
      display: `contract;

abi Counter {
    #[storage(read, write)]
    fn increment(amount: u64) -> u64;

    #[storage(read)]
    fn get() -> u64;
}

storage {
    counter: u64 = 0,
}

impl Counter for Contract {
    #[storage(read, write)]
    fn increment(amount: u64) -> u64 {
        let incremented = storage.counter.read() + amount;
        storage.counter.write(incremented);
        incremented
    }

    #[storage(read)]
    fn get() -> u64 {
        storage.counter.read()
    }
}`,
      copy: `contract;

abi Counter {
    #[storage(read, write)]
    fn increment(amount: u64) -> u64;

    #[storage(read)]
    fn get() -> u64;
}

storage {
    counter: u64 = 0,
}

impl Counter for Contract {
    #[storage(read, write)]
    fn increment(amount: u64) -> u64 {
        let incremented = storage.counter.read() + amount;
        storage.counter.write(incremented);
        incremented
    }

    #[storage(read)]
    fn get() -> u64 {
        storage.counter.read()
    }
}`
    },
    singleAssetSrc20: {
      display: `// ERC20 equivalent in Sway.
contract;

use src3::*;
use src5::*;
use src20::*;
use std::{asset::*, ***, ***};

abi SingleAsset {
    #[storage(read, write)]
    fn constructor(owner_: Identity);
}

configurable {
    DECIMALS: u8 = 9u8,
    NAME: str[7] = __to_str_array("MyAsset"),
    SYMBOL: str[5] = __to_str_array("MYTKN"),
}

storage {
    total_supply: u64 = 0,
    owner: State = State::Uninitialized,
}

impl SRC20 for Contract {
    #[storage(read)]
    fn total_assets() -> u64 {
        1
    }

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        if asset == AssetId::default() {
            Some(storage.total_supply.read())
        } else {
            None
        }
    }

    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        if asset == AssetId::default() {
            Some(String::from_ascii_str(from_str_array(NAME)))
        } else {
            None
        }
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        if asset == AssetId::default() {
            Some(String::from_ascii_str(from_str_array(SYMBOL)))
        } else {
            None
        }
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        if asset == AssetId::default() {
            Some(DECIMALS)
        } else {
            None
        }
    }
}

#[storage(read)]
fn require_access_owner() {
    require(
        storage
            .owner
            .read() == State::Initialized(msg_sender().unwrap()),
        AccessError::NotOwner,
    );
}

impl SingleAsset for Contract {
    #[storage(read, write)]
    fn constructor(owner_: Identity) {
        require(
            storage
                .owner
                .read() == State::Uninitialized,
            "owner-initialized",
        );
        storage.owner.write(State::Initialized(owner_));
    }
}

impl SRC5 for Contract {
    #[storage(read)]
    fn owner() -> State {
        storage.owner.read()
    }
}

impl SRC3 for Contract {
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: Option<SubId>, amount: u64) {
        require(sub_id.is_some() && sub_id.unwrap() == DEFAULT_SUB_ID, "incorrect-sub-id");
        require_access_owner();

        let current_supply = storage.total_supply.read();
        storage
            .total_supply
            .write(current_supply + amount);
        mint_to(recipient, DEFAULT_SUB_ID, amount);
        TotalSupplyEvent::new(AssetId::default(), current_supply + amount, msg_sender().unwrap()).log();
    }

    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64) {
        require(sub_id == DEFAULT_SUB_ID, "incorrect-sub-id");
        require(msg_amount() >= amount, "incorrect-amount-provided");
        require(
            msg_asset_id() == AssetId::default(),
            "incorrect-asset-provided",
        );
        require_access_owner();

        let current_supply = storage.total_supply.read();
        storage
            .total_supply
            .write(current_supply - amount);
        burn(DEFAULT_SUB_ID, amount);
        TotalSupplyEvent::new(AssetId::default(), current_supply - amount, msg_sender().unwrap()).log();
    }
}

abi EmitSRC20Events {
    fn emit_src20_events();
}

impl EmitSRC20Events for Contract {
    fn emit_src20_events() {
        // Metadata that is stored as a configurable should only be emitted once.
        let asset = AssetId::default();
        let sender = msg_sender().unwrap();
        let name = Some(String::from_ascii_str(from_str_array(NAME)));
        let symbol = Some(String::from_ascii_str(from_str_array(SYMBOL)));

        SetNameEvent::new(asset, name, sender).log();
        SetSymbolEvent::new(asset, symbol, sender).log();
        SetDecimalsEvent::new(asset, DECIMALS, sender).log();
    }
}
`,
      copy: `// ERC20 equivalent in Sway.
contract;

use src3::SRC3;
use src5::{AccessError, SRC5, State};
use src20::{SetDecimalsEvent, SetNameEvent, SetSymbolEvent, SRC20, TotalSupplyEvent};
use std::{
    asset::{
        burn,
        mint_to,
    },
    call_frames::{
        msg_asset_id,
    },
    constants::DEFAULT_SUB_ID,
    context::msg_amount,
    string::String,
};

abi SingleAsset {
    #[storage(read, write)]
    fn constructor(owner_: Identity);
}

configurable {
    DECIMALS: u8 = 9u8,
    NAME: str[7] = __to_str_array("MyAsset"),
    SYMBOL: str[5] = __to_str_array("MYTKN"),
}

storage {
    total_supply: u64 = 0,
    owner: State = State::Uninitialized,
}

impl SRC20 for Contract {
    #[storage(read)]
    fn total_assets() -> u64 {
        1
    }

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        if asset == AssetId::default() {
            Some(storage.total_supply.read())
        } else {
            None
        }
    }

    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        if asset == AssetId::default() {
            Some(String::from_ascii_str(from_str_array(NAME)))
        } else {
            None
        }
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        if asset == AssetId::default() {
            Some(String::from_ascii_str(from_str_array(SYMBOL)))
        } else {
            None
        }
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        if asset == AssetId::default() {
            Some(DECIMALS)
        } else {
            None
        }
    }
}

#[storage(read)]
fn require_access_owner() {
    require(
        storage
            .owner
            .read() == State::Initialized(msg_sender().unwrap()),
        AccessError::NotOwner,
    );
}

impl SingleAsset for Contract {
    #[storage(read, write)]
    fn constructor(owner_: Identity) {
        require(
            storage
                .owner
                .read() == State::Uninitialized,
            "owner-initialized",
        );
        storage.owner.write(State::Initialized(owner_));
    }
}

impl SRC5 for Contract {
    #[storage(read)]
    fn owner() -> State {
        storage.owner.read()
    }
}

impl SRC3 for Contract {
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: Option<SubId>, amount: u64) {
        require(sub_id.is_some() && sub_id.unwrap() == DEFAULT_SUB_ID, "incorrect-sub-id");
        require_access_owner();

        let current_supply = storage.total_supply.read();
        storage
            .total_supply
            .write(current_supply + amount);
        mint_to(recipient, DEFAULT_SUB_ID, amount);
        TotalSupplyEvent::new(AssetId::default(), current_supply + amount, msg_sender().unwrap()).log();
    }

    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64) {
        require(sub_id == DEFAULT_SUB_ID, "incorrect-sub-id");
        require(msg_amount() >= amount, "incorrect-amount-provided");
        require(
            msg_asset_id() == AssetId::default(),
            "incorrect-asset-provided",
        );
        require_access_owner();

        let current_supply = storage.total_supply.read();
        storage
            .total_supply
            .write(current_supply - amount);
        burn(DEFAULT_SUB_ID, amount);
        TotalSupplyEvent::new(AssetId::default(), current_supply - amount, msg_sender().unwrap()).log();
    }
}

abi EmitSRC20Events {
    fn emit_src20_events();
}

impl EmitSRC20Events for Contract {
    fn emit_src20_events() {
        // Metadata that is stored as a configurable should only be emitted once.
        let asset = AssetId::default();
        let sender = msg_sender().unwrap();
        let name = Some(String::from_ascii_str(from_str_array(NAME)));
        let symbol = Some(String::from_ascii_str(from_str_array(SYMBOL)));

        SetNameEvent::new(asset, name, sender).log();
        SetSymbolEvent::new(asset, symbol, sender).log();
        SetDecimalsEvent::new(asset, DECIMALS, sender).log();
    }
}
`
    },
    multiAssetSrc20: {
      display: `// ERC1155 equivalent in Sway.
contract;

use src3::*;
use src5::*;
use src20::*;
use std::{asset::*, ***, ***};

storage {
    total_assets: u64 = 0,
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    name: StorageMap<AssetId, StorageString> = StorageMap {},
    symbol: StorageMap<AssetId, StorageString> = StorageMap {},
    decimals: StorageMap<AssetId, u8> = StorageMap {},
    owner: State = State::Uninitialized,
}

abi MultiAsset {
    #[storage(read, write)]
    fn constructor(owner_: Identity);

    #[storage(read, write)]
    fn set_name(asset: AssetId, name: String);

    #[storage(read, write)]
    fn set_symbol(asset: AssetId, symbol: String);

    #[storage(read, write)]
    fn set_decimals(asset: AssetId, decimals: u8);
}

impl MultiAsset for Contract {
    #[storage(read, write)]
    fn constructor(owner_: Identity) {
        require(
            storage
                .owner
                .read() == State::Uninitialized,
            "owner-initialized",
        );
        storage.owner.write(State::Initialized(owner_));
    }

    #[storage(read, write)]
    fn set_name(asset: AssetId, name: String) {
        require_access_owner();
        storage.name.insert(asset, StorageString {});
        storage.name.get(asset).write_slice(name);
        SetNameEvent::new(asset, Some(name), msg_sender().unwrap()).log();
    }

    #[storage(read, write)]
    fn set_symbol(asset: AssetId, symbol: String) {
        require_access_owner();
        storage.symbol.insert(asset, StorageString {});
        storage.symbol.get(asset).write_slice(symbol);
        SetSymbolEvent::new(asset, Some(symbol), msg_sender().unwrap()).log();
    }

    #[storage(read, write)]
    fn set_decimals(asset: AssetId, decimals: u8) {
        require_access_owner();
        storage.decimals.insert(asset, decimals);
        SetDecimalsEvent::new(asset, decimals, msg_sender().unwrap()).log();
    }
}

#[storage(read)]
fn require_access_owner() {
    require(
        storage
            .owner
            .read() == State::Initialized(msg_sender().unwrap()),
        AccessError::NotOwner,
    );
}

impl SRC20 for Contract {
    #[storage(read)]
    fn total_assets() -> u64 {
        storage.total_assets.read()
    }

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        storage.total_supply.get(asset).try_read()
    }

    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        storage.name.get(asset).read_slice()
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        storage.symbol.get(asset).read_slice()
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        storage.decimals.get(asset).try_read()
    }
}

impl SRC3 for Contract {
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: Option<SubId>, amount: u64) {
        require_access_owner();
        let sub_id = match sub_id {
            Some(id) => id,
            None => SubId::zero(),
        };
        let asset_id = AssetId::new(ContractId::this(), sub_id);
        let supply = storage.total_supply.get(asset_id).try_read();
        if supply.is_none() {
            storage
                .total_assets
                .write(storage.total_assets.try_read().unwrap_or(0) + 1);
        }
        let current_supply = supply.unwrap_or(0);
        storage
            .total_supply
            .insert(asset_id, current_supply + amount);
        mint_to(recipient, sub_id, amount);
        TotalSupplyEvent::new(asset_id, current_supply + amount, msg_sender().unwrap()).log();
    }

    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64) {
        require_access_owner();
        let asset_id = AssetId::new(ContractId::this(), sub_id);
        require(this_balance(asset_id) >= amount, "not-enough-coins");

        let supply = storage.total_supply.get(asset_id).try_read();
        let current_supply = supply.unwrap_or(0);
        storage
            .total_supply
            .insert(asset_id, current_supply - amount);
        burn(sub_id, amount);
        TotalSupplyEvent::new(asset_id, current_supply - amount, msg_sender().unwrap()).log();
    }
}
`,
      copy: `// ERC1155 equivalent in Sway.
contract;

use src5::{AccessError, SRC5, State};
use src20::{SetDecimalsEvent, SetNameEvent, SetSymbolEvent, SRC20, TotalSupplyEvent};
use src3::SRC3;
use std::{
    asset::{
        burn,
        mint_to,
    },
    call_frames::msg_asset_id,
    context::this_balance,
    hash::{
        Hash,
    },
    storage::storage_string::*,
    string::String,
};

storage {
    total_assets: u64 = 0,
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    name: StorageMap<AssetId, StorageString> = StorageMap {},
    symbol: StorageMap<AssetId, StorageString> = StorageMap {},
    decimals: StorageMap<AssetId, u8> = StorageMap {},
    owner: State = State::Uninitialized,
}

abi MultiAsset {
    #[storage(read, write)]
    fn constructor(owner_: Identity);

    #[storage(read, write)]
    fn set_name(asset: AssetId, name: String);

    #[storage(read, write)]
    fn set_symbol(asset: AssetId, symbol: String);

    #[storage(read, write)]
    fn set_decimals(asset: AssetId, decimals: u8);
}

impl MultiAsset for Contract {
    #[storage(read, write)]
    fn constructor(owner_: Identity) {
        require(
            storage
                .owner
                .read() == State::Uninitialized,
            "owner-initialized",
        );
        storage.owner.write(State::Initialized(owner_));
    }

    #[storage(read, write)]
    fn set_name(asset: AssetId, name: String) {
        require_access_owner();
        storage.name.insert(asset, StorageString {});
        storage.name.get(asset).write_slice(name);
        SetNameEvent::new(asset, Some(name), msg_sender().unwrap()).log();
    }

    #[storage(read, write)]
    fn set_symbol(asset: AssetId, symbol: String) {
        require_access_owner();
        storage.symbol.insert(asset, StorageString {});
        storage.symbol.get(asset).write_slice(symbol);
        SetSymbolEvent::new(asset, Some(symbol), msg_sender().unwrap()).log();
    }

    #[storage(read, write)]
    fn set_decimals(asset: AssetId, decimals: u8) {
        require_access_owner();
        storage.decimals.insert(asset, decimals);
        SetDecimalsEvent::new(asset, decimals, msg_sender().unwrap()).log();
    }
}

#[storage(read)]
fn require_access_owner() {
    require(
        storage
            .owner
            .read() == State::Initialized(msg_sender().unwrap()),
        AccessError::NotOwner,
    );
}

impl SRC20 for Contract {
    #[storage(read)]
    fn total_assets() -> u64 {
        storage.total_assets.read()
    }

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        storage.total_supply.get(asset).try_read()
    }

    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        storage.name.get(asset).read_slice()
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        storage.symbol.get(asset).read_slice()
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        storage.decimals.get(asset).try_read()
    }
}

impl SRC3 for Contract {
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: Option<SubId>, amount: u64) {
        require_access_owner();
        let sub_id = match sub_id {
            Some(id) => id,
            None => SubId::zero(),
        };
        let asset_id = AssetId::new(ContractId::this(), sub_id);
        let supply = storage.total_supply.get(asset_id).try_read();
        if supply.is_none() {
            storage
                .total_assets
                .write(storage.total_assets.try_read().unwrap_or(0) + 1);
        }
        let current_supply = supply.unwrap_or(0);
        storage
            .total_supply
            .insert(asset_id, current_supply + amount);
        mint_to(recipient, sub_id, amount);
        TotalSupplyEvent::new(asset_id, current_supply + amount, msg_sender().unwrap()).log();
    }

    #[payable]
    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64) {
        require_access_owner();
        let asset_id = AssetId::new(ContractId::this(), sub_id);
        require(this_balance(asset_id) >= amount, "not-enough-coins");

        let supply = storage.total_supply.get(asset_id).try_read();
        let current_supply = supply.unwrap_or(0);
        storage
            .total_supply
            .insert(asset_id, current_supply - amount);
        burn(sub_id, amount);
        TotalSupplyEvent::new(asset_id, current_supply - amount, msg_sender().unwrap()).log();
    }
}
`
    }
  }

  const [selectedContract, setSelectedContract] = useState<keyof typeof contractExamples>("counter")
  const [code, setCode] = useState(contractExamples.counter.display)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCode(contractExamples[selectedContract].display)
  }, [selectedContract])

  useEffect(() => {
    Prism.highlightAll()
  }, [code])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractExamples[selectedContract].copy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-cyan-100 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={scrollToTop}>
              <img src="/logo.png" alt="Sway Logo" className="w-6 h-6" />
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
                <Link href="https://github.com/fuelLabs/sway" target="_blank" rel="noopener noreferrer">
                  <div className="h-5 w-5" dangerouslySetInnerHTML={{ __html: siGithub.svg }} />
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <Link href="https://x.com/swaylang" target="_blank" rel="noopener noreferrer">
                  <div className="h-5 w-5" dangerouslySetInnerHTML={{ __html: siX.svg }} />
                </Link>
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
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6">
              <img src="/logo.png" alt="Sway Logo" className="w-24 h-24" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
              Sway
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Smart contract language of the future. ☀️
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
                Get started <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-emerald-200 hover:bg-emerald-50 bg-transparent">
              <Link href="https://github.com/FuelLabs/sway-examples" className="flex items-center" target="_blank" rel="noopener noreferrer">
                <Code className="mr-2 h-4 w-4" />
                View examples
              </Link>
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
                      Counter contract
                    </SelectItem>
                    <SelectItem value="singleAssetSrc20" className="text-gray-300 hover:bg-gray-700">
                      Single asset contract
                    </SelectItem>
                    <SelectItem value="multiAssetSrc20" className="text-gray-300 hover:bg-gray-700">
                      Multi asset contract
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
                <pre
                  className="w-full h-96 p-6 text-gray-300 font-mono text-sm overflow-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-emerald-600 hover:scrollbar-thumb-emerald-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                  style={{ backgroundColor: '#111827' }}
                >
                  <code
                    className="language-rust"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    {code}
                  </code>
                </pre>
                <style jsx>{`
                  pre::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                  }
                  
                  pre::-webkit-scrollbar-track {
                    background: #1f2937;
                    border-radius: 10px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                  }
                  
                  pre::-webkit-scrollbar-thumb {
                    background: linear-gradient(45deg, #059669, #0d9488);
                    border-radius: 10px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                  }
                  
                  pre:hover::-webkit-scrollbar-track,
                  pre:focus::-webkit-scrollbar-track {
                    opacity: 1;
                  }
                  
                  pre:hover::-webkit-scrollbar-thumb,
                  pre:focus::-webkit-scrollbar-thumb {
                    opacity: 1;
                  }
                  
                  pre::-webkit-scrollbar-thumb:hover {
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
                  <Link
                    href={
                      selectedContract === "counter"
                        ? "https://www.sway-playground.org/?toolchain=testnet&transpile=false&gist=3db6631edc4ccf828ba869d22a32e132"
                        : selectedContract === "singleAssetSrc20"
                          ? "https://www.sway-playground.org/?toolchain=testnet&transpile=false&gist=d5b7964fdd9a8c6e90f220e32b4111a7"
                          : "https://www.sway-playground.org/?toolchain=testnet&transpile=false&gist=98b11f6b02478b12ea579ef2c3391729"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="mr-2">🏄‍♂️</span>
                    Deploy with Sway playground
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
            <h2 className="text-4xl font-bold mb-4 text-gray-900">🏖️ Dive right in</h2>
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
                    Launch playground
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
                    <div className="mr-2 h-4 w-4" dangerouslySetInnerHTML={{ __html: siGithub.svg }} />
                    View on GitHub
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>


        </div>
      </section>

      {/* Language Section */}
      <section id="language" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              <img src="/logo.png" alt="Sway Logo" className="inline w-8 h-8 mr-2" />
              The Sway language
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rust-inspired syntax meets blockchain efficiency. Write smart contracts that are both safe and performant.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle>Type Safe</CardTitle>
                <CardDescription>
                  Expressive type system with generics, algebraic types, and compile-time safety checks such as the CEI pattern.
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
              <Link href="https://docs.fuel.network/docs/sway/" className="flex items-center" target="_blank" rel="noopener noreferrer">
                <BookOpen className="mr-2 h-4 w-4" />
                Read the Sway book
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Forc Section */}
      <section id="forc" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">⚡ Forc toolchain</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The complete toolkit for Sway development. Build, test, and deploy with ease.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-amber-200">
              <CardHeader>
                <Settings className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Build system</CardTitle>
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
                <CardTitle>Development tools</CardTitle>
                <CardDescription className="mb-4">
                  Integrated testing, formatting, and deployment tools for a smooth developer experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className=" flex flex-wrap items-center gap-3">
                  <Badge 
                    variant="secondary" 
                    href="https://docs.fuel.network/docs/sway/testing/testing_with_forc_call/#forc-call" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    forc call
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    href="https://docs.fuel.network/docs/sway/testing/unit-testing/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    forc test
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    href="https://docs.fuel.network/docs/forc/plugins/forc_deploy/#forc-deploy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    forc deploy
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16 text-center">
            <Button size="lg" variant="outline" className="border-amber-200 hover:bg-amber-50 bg-transparent">
              <Link href="https://docs.fuel.network/docs/forc/" className="flex items-center" target="_blank" rel="noopener noreferrer">
                <Settings className="mr-2 h-4 w-4" />
                Explore Forc toolchain
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Libraries Section */}
      <section id="libraries" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">📚 Sway libraries</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A growing ecosystem of reusable libraries to accelerate your development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Asset", description: "Asset management utilities", downloads: "5.1k" },
              { name: "Pausable", description: "Emergency stop functionality", downloads: "5.1k" },
              { name: "Signed Integers", description: "Signed integers for Sway", downloads: "5.1k" },
              { name: "Reentrancy Guard", description: "Provides an API to check for reentrancy", downloads: "4.8k" },
              { name: "Merkle", description: "Merkle tree verification", downloads: "3.2k" },
              { name: "Upgradability", description: "Simple upgradability proxies", downloads: "2.9k" },
            ].map((lib, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{lib.name}</CardTitle>
                    {/* <Badge variant="outline" className="text-xs">
                      {lib.downloads}
                    </Badge> */}
                  </div>
                  <CardDescription className="text-sm">{lib.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Button size="lg" variant="outline" className="border-emerald-200 hover:bg-emerald-50 bg-transparent">
              <Link
                href="https://docs.fuel.network/docs/sway-libs/"
                className="flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Sway libraries
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
                  SRC standards
                </CardTitle>
                <CardDescription>
                  Sway Request for Comments - defining token standards, interfaces, and protocols.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link
                    href="https://docs.fuel.network/docs/sway-standards/src-20-native-asset/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="font-medium">SRC-20</span>
                      <div className="flex items-center gap-2">
                        <Badge>Fungible Tokens</Badge>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="https://docs.fuel.network/docs/sway-standards/src-721-non-fungible-token/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="font-medium">SRC-721</span>
                      <div className="flex items-center gap-2">
                        <Badge>Non-Fungible Tokens</Badge>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="https://docs.fuel.network/docs/sway-standards/src-1155-multi-token/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="font-medium">SRC-1155</span>
                      <div className="flex items-center gap-2">
                        <Badge>Multi-Token</Badge>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link
                      href="https://docs.fuel.network/docs/sway-standards/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View all standards
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  Style guide
                </CardTitle>
                <CardDescription>
                  Coding conventions and best practices for writing clean, maintainable Sway code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5 flex flex-col justify-between">
                  <div className="text-sm text-gray-600">• Naming conventions</div>
                  <div className="text-sm text-gray-600">• Code organization</div>
                  <div className="text-sm text-gray-600">• Documentation standards</div>
                  <div className="text-sm text-gray-600">• Security best practices</div>
                </div>
                <div className="mt-5">
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link
                      href="https://docs.fuel.network/docs/sway/reference/style_guide/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read style guide
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
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
            <h2 className="text-4xl font-bold mb-4 text-gray-900">📦 Sway registry</h2>
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
                  <h3 className="font-semibold text-lg">📥 Install packages</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <code className="text-green-400 text-sm">
                      forc add &lt;package-name&gt;
                    </code>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">📤 Publish packages</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <code className="text-green-400 text-sm">forc publish</code>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <Button
                  onClick={() => window.open("https://forc.pub/", "_blank")}
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
                <img src="/logo.png" alt="Sway Logo" className="w-8 h-8" />
                <span className="text-xl font-bold">Sway</span>
              </div>
              <p className="text-gray-400">A chill smart contract language for the Fuel ecosystem. 🏖️</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Language</h3>
              <div className="space-y-2 text-gray-400">
                <div><Link href="https://docs.fuel.network/docs/sway/" className="flex items-center" target="_blank" rel="noopener noreferrer">Documentation</Link></div>
                <div><Link href="https://github.com/FuelLabs/sway-examples" className="flex items-center" target="_blank" rel="noopener noreferrer">Examples</Link></div>
                <div><Link href="https://sway-playground.org/" className="flex items-center" target="_blank" rel="noopener noreferrer">Playground</Link></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Tools</h3>
              <div className="space-y-2 text-gray-400">
                <div><Link href="https://github.com/FuelLabs/forc" className="flex items-center" target="_blank" rel="noopener noreferrer">Forc CLI</Link></div>
                <div><Link href="https://docs.fuel.network/docs/sway/lsp/#sway-lsp" className="flex items-center" target="_blank" rel="noopener noreferrer">Sway LSP</Link></div>
                <div><Link href="https://forc.pub/" className="flex items-center" target="_blank" rel="noopener noreferrer">Sway registry</Link></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <div className="space-y-2 text-gray-400">
                <div><Link href="https://docs.fuel.network/docs/forc/" className="flex items-center" target="_blank" rel="noopener noreferrer">GitHub</Link></div>
                <div><Link href="https://x.com/swaylang" className="flex items-center" target="_blank" rel="noopener noreferrer">X</Link></div>
                <div><Link href="https://forum.fuel.network/" className="flex items-center" target="_blank" rel="noopener noreferrer">Forum</Link></div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="text-center text-gray-400">
            <p>Built with <img src="/logo.png" alt="Sway Logo" className="inline w-4 h-4 mx-1" /> and ❤️</p>

          </div>
        </div>
      </footer>
    </div>
  )
}
