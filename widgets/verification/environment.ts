import { IUbirchVerificationEnvConfig } from './models';

export default {
    verify_api_url: 'https://verify.dev.ubirch.com/api/upp/verify/anchor?blockchain_info=ext',
    blockchain_transid_check_url: {
        'ethereum-classic': {
            testnet: {
                url: 'https://kottiexplorer.ethernode.io/search?q=',
                icon_url: '/fileadmin/Bilder/Zertifikate/Ethereum-Classic_verify_right.png'
            },
            mainnet: {
                url: 'https://classic.etccoopexplorer.com/tx/0x',
                icon_url: '/fileadmin/Bilder/Zertifikate/Ethereum-Classic_verify_right.png'
            }
        },
        ethereum: {
            testnet: {
                url: 'https://rinkeby.etherscan.io/tx/',
                icon_url: '/fileadmin/Bilder/Zertifikate/Ethereum_verify_right.png'
            },
            mainnet: {
                url: 'https://etherscan.io/tx/',
                icon_url: '/fileadmin/Bilder/Zertifikate/Ethereum_verify_right.png'
            }
        },
        iota: {
            testnet: {
                url: 'https://comnet.thetangle.org/transaction/',
                icon_url: '/fileadmin/Bilder/Zertifikate/IOTA_verify_right.png'
            },
            mainnet: {
                url: 'https://thetangle.org/transaction/',
                icon_url: '/fileadmin/Bilder/Zertifikate/IOTA_verify_right.png'
            }
        },
        regioit: {
            bdr: {
                url: 'https://rinkeby.etherscan.io/tx/',
                icon_url: '/fileadmin/Bilder/Zertifikate/GovDigital_Icon_verify.png'
           }
        }
    },
    seal_icon_url: '/fileadmin/Bilder/Zertifikate/ubirch_verify_right.png',
    no_seal_icon_url: '/fileadmin/Bilder/Zertifikate/ubirch_verify_wrong.png',
} as IUbirchVerificationEnvConfig;
