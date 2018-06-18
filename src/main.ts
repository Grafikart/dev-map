import data from './technologies.json'
import * as d3 from 'd3'
import { dataToLinks, dataToNodes } from './modules/formatters'
import { ILink, INode } from './Interfaces'
import { nodesWithDependencies } from './modules/filters'
import Graph from './modules/graph'

const baseNodes = dataToNodes(data)
const baseLinks = dataToLinks(data, baseNodes)

let graph = new Graph(baseNodes, baseLinks)
graph.onNodeClick(node => {
  let evolutions = baseLinks.filter(link => link.target === node).map(link => link.source.name)
  graph.build(nodesWithDependencies([node.name, ...evolutions], baseNodes, baseLinks))
})
graph.build()

// Jobs shortcut
const $jobs = document.querySelector('#js-jobs') as HTMLElement
let $activeJob: HTMLElement|null = null
Object.keys(data.jobs).forEach(function (name) {
  let $a = document.createElement('a')
  $a.innerHTML = name
  $a.addEventListener('click', function () {
    if ($activeJob) {
      $activeJob.classList.remove('is-active')
    }
    graph.build(nodesWithDependencies(data.jobs[name], baseNodes, baseLinks))
    $activeJob = $a
    $a.classList.add('is-active')
  })
  $jobs.appendChild($a)
})

// Search a technology
const $form = document.querySelector('#js-form') as HTMLFormElement
$form.addEventListener('submit', function (e): void {
  e.preventDefault()
  let q = new FormData($form).get('q') as string
  if (q === '') {
    return graph.build()
  }
  let node = baseNodes.find(node => node.name.toLowerCase() === q.toLowerCase())
  if (node === undefined) {
    return alert('No technology match "' + q + '"')
  }
  graph.build(nodesWithDependencies([node.name], baseNodes, baseLinks))
})

if (module.hot) {
  module.hot.accept(function () {
    window.location.reload()
  })
}
