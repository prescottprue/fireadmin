describe('Verify main home page functionality', () => {
  before(async function() {
    this.retries(3)
    await nightmare.activateLogging().login()
  })

  after(async () => {
    await nightmare.end()
  })

  it('login brings user to project page', async () => {
    const numLinks = await nightmare
      .log('Verifying new tile on project page')
      .wait('#new-project-tile')
      .evaluate(links => {
        return !!document.querySelector(links)
      }, '#new-project-tile')

    expect(numLinks).to.equal(true)
  })
})
