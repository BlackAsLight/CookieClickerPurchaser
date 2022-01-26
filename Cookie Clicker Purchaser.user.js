// ==UserScript==
// @name         Cookie Clicker Purchaser
// @namespace    https://github.com/BlackAsLight
// @version      0.1
// @description  Auto Buy The Best New Stuff
// @author       BlackAsLight
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
function getPrice(text) {
    if (text[0].indexOf('+') === -1) {
        return parseFloat(text[0]) * (() => {
            switch (text[1]) {
                case 'million':
                    return Math.pow(10, 6)
                case 'billion':
                    return Math.pow(10, 9)
                case 'trillion':
                    return Math.pow(10, 12)
                case 'quadrillion':
                    return Math.pow(10, 15)
                case 'quintillion':
                    return Math.pow(10, 18)
                case 'sextillion':
                    return Math.pow(10, 21)
                case 'septillion':
                    return Math.pow(10, 24)
                case 'octillion':
                    return Math.pow(10, 27)
                case 'nonillion':
                    return Math.pow(10, 30)
                default:
                    return 1
            }
        })()
    }
    text = text[0].split('e+')
    return parseFloat(text[0]) * Math.pow(10, parseInt(text[1]))
}

function getProduct(best) {
    return Array.from(document.querySelectorAll('.product'))
        .filter(x => x.classList.contains(best ? 'unlocked' : 'enabled'))
        .map(x => {
        const price = getPrice(x.querySelector('.price').textContent.replaceAll(',', '').split(' '))
        x.onmouseover()
        const cookies = (() => {
            try {
                return parseFloat(document.querySelector('#tooltipAnchor').querySelector('.data b').textContent.replaceAll(',', ''))
            }
            catch {
                return x.classList.contains('enabled') ? Infinity : 0
            }
        })()
        x.onmouseout()
        return {
            title: x.querySelector('.title').textContent,
            worth: Math.round(price / cookies),
            tag: x
        }
    })
        .reduce((x, y) => x.worth < y.worth ? x : y, 0)
}

async function Sleep(ms) {
    return new Promise(x => setTimeout(() => x(true), ms))
}

async function Main() {
    while (true) {
        check: while (document.querySelector('#techUpgrades').childElementCount) {
            const tag = document.querySelector('#techUpgrades').children[0]
            if (tag.classList.contains('disabled')) {
                break check
            }
            tag.click()
            console.info('Started Research')
            await Sleep(1000)
        }

        let product = getProduct(true)
        count: for (let i = 0; i <= 10; ++i) {
            if (document.querySelector('#shimmers').childElementCount) {
                document.querySelector('#shimmers').children[0].click()
            }
            if (product) {
                if (product.tag.classList.contains('enabled')) {
                    product.tag.click()
                    console.info(`Purchased ${product.title}`)
                    break count
                }
                console.info(`Wants ${product.title}`)
                const tag = document.querySelector('#upgrades').children[0]
                if (tag.classList.contains('enabled')) {
                    tag.onmouseover()
                    tag.click()
                    console.info(`Purchased ${document.querySelector('#tooltipAnchor').querySelector('.name').textContent}`)
                    break count
                }
            }
            await Sleep(2000)
            if (i === 9) {
                product = getProduct(false)
            }
        }
        await Sleep(100)
    }
}

Main()
