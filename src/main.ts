import data from './technologies.json'
import * as d3 from 'd3'
import { dataToLinks, dataToNodes } from './modules/formatters'
import { ILink, INode } from './Interfaces'
import { nodesWithDependencies } from './modules/filters'

const baseNodes = dataToNodes(data)
const baseLinks = dataToLinks(data, baseNodes)
let nodes = [...baseNodes]
let links = [...baseLinks]

// On construit le SVG
const radius = 25
const width = window.innerWidth
const height = window.innerHeight

const svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)

svg.append('svg:defs').append('svg:marker')
  .attr('id', 'triangle')
  .attr('refX', 15)
  .attr('refY', 3)
  .attr('markerWidth', 30)
  .attr('markerHeight', 30)
  .attr('orient', 'auto')
  .append('path')
  .attr('d', 'M 0 0 6 3 0 6 0 3')
  .style('fill', 'black')

const linkGroup = svg.append('g').attr('class', 'links')
const nodeGroup = svg.append('g').attr('class', 'nodes')

svg.call(d3.zoom().on("zoom", function () {
  nodeGroup.attr("transform", d3.event.transform)
  linkGroup.attr("transform", d3.event.transform)
}))

// Let's build the forces
const radiusFc = function (incr = 0) {
  return function (node: INode) {
    return isSource(node) ? radius * 1.5 + incr : radius + incr
  }
}

const linkForce = d3
  .forceLink()
  .id((node: INode) => node.name)
  .distance(radiusFc(45))


const simulation = d3
  .forceSimulation()
  .force('charge', d3.forceManyBody().strength(-200))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide(radiusFc()))
  .force('link', linkForce)

let linkElements, nodeElements

const updateDOM = function () {
  linkElements = linkGroup
    .selectAll('line')
    .data(links, link => link.source + link.target)

  linkElements.exit().remove()

  linkElements = linkElements
    .enter().append('line')
    .attr('marker-end', 'url(#triangle)')
    .merge(linkElements)

  nodeElements = nodeGroup
    .selectAll('g')
    .data(nodes, node => node.slug)

  nodeElements.exit().remove()

  nodeElements = nodeElements
    .enter()
    .append('g')
    .attr('class', node => 'node node-' + node.type)
    .merge(nodeElements)

  nodeElements
    .append('circle')
    .attr('r', radiusFc(10))
    .attr('class', 'ring')

  nodeElements
    .append('circle')
    .attr('r', radiusFc())
    .attr('class', 'outline')

  nodeElements
    .append('text')
    .text(node => node.name)
    .attr('pointer-event', 'none')
    .attr('fill', '#FFFFFF')
    .attr('font-size', '10px')
    .attr('text-anchor', 'middle')
    .attr('dy', 4)
}

/**
 * Find if a node is a "Source" node (no dependencies)
 * @param {INode} node
 * @return {boolean}
 */
const isSource = function (node: INode): boolean {
  return baseLinks.find(link => link.source === node) === undefined
}

const updateSimulation = function () {
  updateDOM()
  simulation.alpha(1)
  simulation.nodes(nodes).on('tick', (e) => {
    nodeElements
      .attr('style', node => `transform: translate3d(${node.x}px, ${node.y}px, 0)`)
    linkElements
      .attr('x1', link => link.target.x)
      .attr('y1', link => link.target.y)
      .attr('x2', link => link.source.x)
      .attr('y2', link => link.source.y)
  })
  simulation.alphaTarget(0).restart()
  simulation.force('link').links(links)
}

const filter = (names: string[]) => {
  let d = nodesWithDependencies(names, baseNodes, baseLinks)
  nodes = d.nodes
  links = d.links
  updateSimulation()
}

const $jobs = document.querySelector('#js-jobs') as HTMLElement
const $form = document.querySelector('#js-form') as HTMLFormElement
Object.keys(data.jobs).forEach(function (name) {
  let $a = document.createElement('a')
  $a.innerHTML = name
  $a.addEventListener('click', function () {
    filter(data.jobs[name])
  })
  $jobs.appendChild($a)
})
$form.addEventListener('submit', function (e): void {
  e.preventDefault()
  let q = new FormData($form).get('q') as string
  if (q === '') {
    return alert('Empty search :(')
  }
  let node = baseNodes.find(node => node.name.toLowerCase() === q.toLowerCase())
  if (node === undefined) {
    return alert('No technology match "' + q + '"')
  }
  filter(filter([node.name]))
})

updateSimulation()

// Hot Reload (parcel)
if (module.hot) {
  module.hot.accept(function () {
    window.location.reload()
  })
}

