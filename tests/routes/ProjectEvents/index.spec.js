import ProjectEvents from 'routes/ProjectEvents'

describe('(Route) ProjectEvents', () => {
  let _route
  // let _component
  // let _childRoutes

  beforeEach(() => {
    _route = ProjectEvents()
    // _component = _route.getComponent()
    // _childRoutes = _route.getChildRoutes()
  })

  it('Should return a route configuration object', () => {
    expect(ProjectEvents).to.be.a.function
  })

  it('Sets Path to /projectEvents', () => {
    expect(_route.path).to.equal('/projectEvents')
  })
  it('Defines a getComponent function', () => {
    expect(_route.getComponent).to.be.a.function
  })
  it('Defines a getChildRoutes function', () => {
    expect(_route.getChildRoutes).to.be.a.function
  })
})
