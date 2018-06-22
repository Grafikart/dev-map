import { ILink, INode } from '../Interfaces'
import * as d3 from 'd3'
import { Selection, Simulation, SimulationLinkDatum, ZoomBehavior } from 'd3'

export default class Graph {

  private radius = 25
  private nodes: INode[] = []
  private links: ILink[] = []
  private svg: Selection<any, any, any, any>
  private linkGroup: Selection<any, any, any, any>
  private nodeGroup: Selection<any, any, any, any>
  private simulation: Simulation<any, any>
  private zoom: ZoomBehavior<any, any>
  private events: {
    [type: string]: (node: INode) => void
  } = {}

  constructor(nodes: INode[], links: ILink[]) {
    this.links = links
    this.nodes = nodes

    this.svg = d3.select('body').append('svg')
      .attr('width', window.innerWidth)
      .attr('height', window.innerHeight)

    window.addEventListener('resize', () => {
      this.svg
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight)
      this.simulation.force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    })

    this.svg.append('svg:defs').append('svg:marker')
      .attr('id', 'triangle')
      .attr('refX', 20)
      .attr('refY', 3)
      .attr('markerWidth', 30)
      .attr('markerHeight', 30)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 6 3 0 6 0 3')
      .style('fill', 'black')

    this.linkGroup = this.svg.append('g').attr('class', 'links')
    this.nodeGroup = this.svg.append('g').attr('class', 'nodes')

    this.zoom = d3.zoom().on('zoom', () => {
      this.nodeGroup.attr('transform', d3.event.transform)
      this.linkGroup.attr('transform', d3.event.transform)
    })

    this.simulation = d3
      .forceSimulation()
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
      .force('radial', d3.forceRadial(100, window.innerWidth / 2, window.innerHeight / 2).strength(node => {
        return this.isSource(node) ? 0.1 : 0
      }))
      .force('collision', d3.forceCollide(this.radiusGenerator()))
      .force('link', d3.forceLink()
        .id((node: INode) => node.name)
        .distance(this.radiusGenerator(50))
        .strength(0.2)
      )
  }

  /**!
   * Build the graph and restart the simulation
   * @param {INode[]} nodes
   * @param {ILink[]} links
   */
  public build(nodes: INode[] = this.nodes) {
    let links = this.links.filter(link => nodes.includes(link.source) && nodes.includes(link.target))
    let linkElements = this.linkGroup
      .selectAll('line')
      .data(links, (link: ILink) => link.source.name + link.target.name)
    linkElements.exit().remove()
    linkElements = linkElements
      .enter().append('line')
      .attr('marker-end', 'url(#triangle)')
      .merge(linkElements)
    let div = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
    let nodeElements = this.nodeGroup
      .selectAll('g')
      .data(nodes, (node: INode) => node.name)
    nodeElements.exit().remove()
    nodeElements = nodeElements
      .enter()
      .append('g')
      .attr('class', node => 'node node-' + node.type + (this.isSource(node) ? ' node-source' : ''))
      .merge(nodeElements)
    nodeElements
      .append('circle')
      .attr('r', this.radiusGenerator(10))
      .attr('class', 'ring')
    nodeElements
      .append('circle')
      .attr('r', this.radiusGenerator())
      .attr('class', 'outline')
    nodeElements
      .append('text')
      .text(node => node.name)
      .attr('pointer-event', 'none')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
    nodeElements
      .on('mouseover', (node)=>{
        if(node.desc !== null){
          console.log(div)
          div.transition()
            .duration(200)
            .style("opacity", .9)
          div.html(node.desc)
            .style("left", (d3.event.pageX) + "px")    
            .style("top", (d3.event.pageY - 28) + "px");
        }
      })
    nodeElements
      .on('mouseout', (node)=>{
        div.transition()
          .duration(200)
          .style("opacity", 0)
      })
    let onClickCb = () => {
      this.events['click']
    }
    if (this.events['click'] !== undefined) {
      nodeElements
        .on('click', (data)=>{
           div.remove()
          this.events['click'](data)
        })
    }
    // Let's simulate
    this.simulation.alphaDecay(0.0228)
    this.simulation.nodes(nodes).on('tick', () => {
      nodeElements
        .attr('style', node => `transform: translate3d(${node.x}px, ${node.y}px, 0)`)
      linkElements
        .attr('x1', link => link.target.x)
        .attr('y1', link => link.target.y)
        .attr('x2', link => link.source.x)
        .attr('y2', link => link.source.y)
    })
    this.simulation.force('link').links(links)
    // If a filter is active increase the radial force
    if (nodes !== this.nodes) {
      this.simulation.force('radial').strength(node => {
        return this.isSourceOrIsolated(node) ? 0.01 : 0
      })
    }
    if (this.simulation.alpha() !== 1) {
      this.simulation.alpha(1).alphaTarget(0).restart()
    }
    // Reset the view
    this.svg
      .transition()
      .duration(1000)
      .call(this.zoom.transform, d3.zoomIdentity
        .translate(0, 0)
        .scale(1)
      ).on('end', () => {
        this.svg.call(this.zoom)
      })

    const dragDrop = d3.drag()
      .on('start', node => {
        node.fx = node.x
        node.fy = node.y
      })
      .on('drag', node => {
        this.simulation.alphaTarget(0.7).restart()
        node.fx = d3.event.x
        node.fy = d3.event.y
      })
      .on('end', node => {
        if (!d3.event.active) {
          this.simulation.alphaTarget(0)
        }
        node.fx = null
        node.fy = null
      })

    nodeElements.call(dragDrop)
  }

  /**
   * @param {(node: INode) => void} cb
   */
  public onNodeClick(cb: (node: INode) => void) {
    this.events['click'] = cb
  }

  /**
   * Is the node a source node (no requirements)
   * @param {INode} node
   * @return {boolean}
   */
  private isSource(node: INode): boolean {
    return this.isSourceOrIsolated(node) && this.links.find(link => link.target === node) !== undefined
  }

  /**
   * Is the node a source node (no requirements)
   * @param {INode} node
   * @return {boolean}
   */
  private isSourceOrIsolated(node: INode): boolean {
    return this.links.find(link => link.source === node) === undefined
  }

  /**
   * @param {number} incr
   * @return {(node: any) => number}
   */
  private radiusGenerator(incr = 0) {
    return (node: any): number => {
      let ratio = 1
      if (node.type === 'language')
        ratio = 1.2
      if (this.isSource(node))
        ratio = 1.5
      return this.radius * ratio + incr
    }
  }
}
