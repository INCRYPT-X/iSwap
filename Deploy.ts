import chai from 'chai'
import * as ethers from 'ethers'
import {deployContract, solidity} from 'ethereum-waffle'
import {expandTo18Decimals, getCreate2Address} from './shared/utilities'

import iSwapSwapRouter from '../build/iSwapSwapRouter.json'
import iSwapSwapPair from '@iSwapProject/iSwap-swap-core/build/iSwapSwapPair.json'
import iSwapToken from '../build/iSwapToken.json'
import iSwapMaster from '../build/iSwapMaster.json'
import BEP20 from '../build/IBEP20.json'
import {MaxUint256} from 'ethers/constants'
import {BigNumber} from 'ethers/utils'

chai.use(solidity)

describe('iSwapSwapRouter', () => {
  const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
  //  const provider = ethers.getDefaultProvider('rinkeby')
  const privateKey = ''
  const wallet = new ethers.Wallet(privateKey, provider)

  let overrides = {
    //        3022211
    gasLimit: 9999999
  }

  const factoryAddress = '0x9A0615b24C8064F26A3030507c2B5f0DB7F975b4'
  const iSwapTokenAddress = '0x026FE7a3f029F4A2983d31c610b8FACD94e84f6f'
  const iSwapMasterAddress = '0x4b221a21e1152c2aeEB6f43a9E50A174Ae34Ac4c'
  const wbnbAddress = '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f'
  const routeAddress = '0x2A942b802258F50810d4914cF2E5c4f9446Da36a'
  const tctAddress = '0xEEa705FDCFe84775A22062043aef1D4cF90A6337'
  const faiAddress = '0x3be02b05ae44e52adfd51e85a30de209c4184051'

  beforeEach(async () => {
    let gasPrice = await provider.getGasPrice()
    console.log(`current gas Price ${gasPrice}`)
    gasPrice = gasPrice.mul(3)
    console.log(`new gas Price ${gasPrice}`)
    overrides = Object.assign(overrides, {gasPrice: gasPrice.toNumber()})
  })

  it('getCreate2Address', function() {
    let create2Address = getCreate2Address(
      '0x569f6163E8453f0d404D8cA3A06367094cF2c97D',
      ['0xc778417e063141139fce010982780140aa0cd5ab', '0xEEa705FDCFe84775A22062043aef1D4cF90A6337'],
      `0x${iSwapSwapPair.evm.bytecode.object}`
    )
    console.log(`${create2Address}`)
    // 0xdef8c40e2f47a2222fc4b7b2caba3bcf5fda57d9
  })

  it('init code hash', function() {
    const hash = ethers.utils.keccak256(`0x${iSwapSwapPair.evm.bytecode.object}`)
    console.log(hash)
    // 0x5ae9ee982df425710823a8b85d98fec3f9c2be462baf6fa6a220c2bd87385760
  })

  it('deployiSwapToken', async () => {
    console.log(`start deployContract iSwapToken`)
    const iSwapToken = await deployContract(wallet, iSwapToken, [], overrides)
    console.log(`contract iSwapToken address ${iSwapToken.address}`)
    console.log(`contract iSwapToken deploy transaction hash ${iSwapToken.deployTransaction.hash}`)
    await iSwapToken.deployed()
    console.log(`finish deployContract iSwapToken`)
    /**
     * start deployContract iSwapToken
     contract iSwapToken address 0x97196EBee68c58bb2d7D70b71cdDf2C93B9E3216
     contract iSwapToken deploy transaction hash 0xeb15e6bb9fcb8bf2558c5684fd900747c652c6e4f947d2e1f70563a627624d6d
     finish deployContract iSwapToken
     */
  })

  it('deployiSwapMaster', async () => {
    console.log(`start deployContract iSwapMaster`)
    const devAddress = '0xf9e89b5aCA2e6061d22EA98CBCc2d826E3f9E4b1'
    const iSwapStartBlock = new BigNumber(4).mul(new BigNumber(10).pow(17)) // ??????0.4???
    const startBlock = new BigNumber(1815200)
    const bonusEndBlock = startBlock.add(900000)
    const bonusBeforeBulkBlockSize = new BigNumber(30000)
    const bonusEndBulkBlockSize: BigNumber = bonusEndBlock.sub(startBlock)
    // 0.005
    const bonusBeforeCommonDifference = new BigNumber(300).mul(new BigNumber(10).pow(18)).div(bonusBeforeBulkBlockSize)
    console.log('bonusBeforeCommonDifference ' + bonusBeforeCommonDifference)
    // 0.0003 0.009
    const bonusEndCommonDifference = new BigNumber(150)
      .mul(30)
      .mul(new BigNumber(10).pow(18))
      .div(bonusEndBlock.sub(startBlock))
    const iSwapMaster = await deployContract(
      wallet,
      iSwapMaster,
      [
        iSwapTokenAddress,
        devAddress,
        iSwapStartBlock,
        startBlock,
        bonusEndBlock,
        bonusBeforeBulkBlockSize,
        bonusBeforeCommonDifference,
        bonusEndCommonDifference
      ],
      overrides
    )
    console.log(`contract iSwapMaster address ${iSwapMaster.address}`)
    console.log(`contract iSwapMaster deploy transaction hash ${iSwapMaster.deployTransaction.hash}`)
    await iSwapMaster.deployed()
    console.log(`finish deployContract iSwapMaster`)
    /**
     * start deployContract iSwapMaster
     contract iSwapMaster address 0x8fBb5d22Da828c453843435FBc5E83800d121560
     contract iSwapMaster deploy transaction hash 0x94f2b602942933ab729f83538e43efdcf33d5b41c3c3cf99068ef8ed75058971
     finish deployContract iSwapMaster

     // 0xaf0E97C1a44d8d2cB529301859c3a0cD3E8340f0
     */
  })

  it('deployiSwapSwapRouter', async () => {
    console.log(`start deployContract iSwapSwapRouter`)
    const iSwapSwapRouter = await deployContract(wallet, iSwapSwapRouter, [factoryAddress, wbnbAddress], overrides)
    console.log(`contract iSwapSwapRouter address ${iSwapSwapRouter.address}`)
    console.log(`contract iSwapSwapRouter deploy transaction hash ${iSwapSwapRouter.deployTransaction.hash}`)
    await iSwapSwapRouter.deployed()
    console.log(`finish deployContract iSwapSwapRouter`)
    /**
     * start deployContract iSwapSwapRouter
     contract iSwapSwapRouter address 0x9Dc6617335b1b3e8C5859004D783FD041C42320a
     contract iSwapSwapRouter deploy transaction hash 0x419919f03f9ac28a2b3e38e76984c263ef3b52ad2800b0e48698d779dd7ee2de
     finish deployContract iSwapSwapRouter

     */
  })

  it('transferiSwapTokenOwnershipToiSwapMaster', async () => {
    const iSwapToken = new ethers.Contract(iSwapTokenAddress, JSON.stringify(iSwapToken.abi), provider).connect(
      wallet
    )
    const tx = await iSwapToken.transferOwnership(iSwapMasterAddress, {
      ...overrides,
      value: 0
    })
    console.log(`transferiSwapTokenOwnershipToiSwapMaster ${tx.hash}`)
    await tx.wait()
    // 0x8dc1c3eb682efb9db7f3aa21284da0c47286a8b32e52ad85844be8c956bd86c2
  })
})
