import { get } from 'lodash'
import { expect } from 'chai'
import Nightmare from 'nightmare'
import lighthouse from 'lighthouse'
const performanceOnlyConfig = require('lighthouse/lighthouse-core/config/perf.json')

const lighthouseConfig = { port: 5858, output: 'json' }

let results
const nightmare = Nightmare({
  show: false,
  width: 1400,
  height: 1000,
  typeInterval: 80,
  pollInterval: 30,
  waitTimeout: 90000,
  logging: true,
  switches: {
    '--remote-debugging-port': 5858
  }
})

describe('Performance', function() {
  this.timeout(500000)
  before(async function() {
    this.retries(3)
    // Go to Listings page
    await nightmare.goto(`https://google.com`)
    // Call lighthouse performance audit tool
    results = await lighthouse(
      `https://google.com`,
      lighthouseConfig,
      performanceOnlyConfig
    )
  })

  after(async () => {
    await nightmare.end()
  })

  describe('Load Speed', () => {
    it('First Meaningful Paint less than 45 seconds', () => {
      expect(
        get(results, 'audits.first-meaningful-paint.rawValue')
      ).to.be.below(45000)
    })

    // Skipped since these are too long to even get a value
    it.skip('Time to first interactive less than 30 seconds', () => {
      expect(get(results, 'audits.first-interactive.rawValue')).to.be.below(
        30000
      )
    })

    // Skipped since this is too long to even get a value
    it.skip('Time to consisten interactive less than 30 seconds', async () => {
      expect(get(results, 'audits.first-interactive.rawValue')).to.be.below(
        30000
      )
    })

    it('Overall time < 50 seconds', () => {
      expect(get(results, 'timing.total')).to.be.below(50000)
    })
  })

  describe('Network', () => {
    const mbLimit = 8
    it(`Downloads no more than ${mbLimit}mb`, () => {
      const limitInBytes = 8 * 1000000
      expect(get(results, 'audits.total-byte-weight.rawValue')).to.be.below(
        limitInBytes
      )
    })
  })
})
