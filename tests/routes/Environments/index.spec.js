import Environments from 'routes/Environments'

describe('(Route) Environments', () => {
  let _route
  // let _component
  // let _childRoutes

  beforeEach(() => {
    _route = Environments()
    // _component = _route.getComponent()
    // _childRoutes = _route.getChildRoutes()
  })

  it('Should return a route configuration object', () => {
    expect(Environments).to.be.a.function
  })

  it('Sets Path to /environments', () => {
    expect(_route.path).to.equal('/environments')
  })
  it('Defines a getComponent function', () => {
    expect(_route.getComponent).to.be.a.function
  })
  it('Defines a getChildRoutes function', () => {
    expect(_route.getChildRoutes).to.be.a.function
  })
})
