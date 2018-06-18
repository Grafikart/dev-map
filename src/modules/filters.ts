import { ILink, INode } from '../Interfaces'

interface INodesLinks {
  nodes: INode[],
  links: ILink[]
}

/**
 * Find all dependencies for a Node
 * @param {INode} node
 * @param {ILink[]} links
 * @param {INode[]} dependencies
 * @return {INode[]}
 */
const getDependencies = function (node: INode, links: ILink[], dependencies: INode[] = []): INode[] {
  let requirements = links
    .filter(link => link.source.name === node.name)
    .map(link => link.target)
  if (requirements.length === 0) {
    return dependencies
  }
  dependencies = [...dependencies, ...requirements]
  requirements.forEach(requirement => {
    dependencies = getDependencies(requirement, links, dependencies)
  })
  return dependencies
}

/**
 * Extract Nodes and Links form a list
 * @param {string[]} names
 * @param {INode[]} nodes
 * @param {ILink[]} links
 * @return {INodesLinks}
 */
export const nodesWithDependencies = function (names: string[], nodes: INode[], links: ILink[]): INodesLinks {
  let filteredNodes = nodes.filter(node => names.includes(node.name))
  filteredNodes.forEach(node => {
    filteredNodes = [...filteredNodes, ...getDependencies(node, links)]
  })
  filteredNodes = Array.from(new Set(filteredNodes))
  let filteredLinks = links.filter(link => filteredNodes.includes(link.source) && filteredNodes.includes(link.target))
  return {
    nodes: filteredNodes,
    links: filteredLinks
  }
}
