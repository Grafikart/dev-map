import { IData, ILink, INode } from '../Interfaces'

export const dataToNodes = function (data: IData): INode[] {
  return data.technologies.map(function (tech) {
    return {
      name: tech.name,
      type: tech.type,
      desc: tech.desc
    }
  })
}

export const dataToLinks = function (data: IData, nodes: INode[]): ILink[] {
  let links: ILink[] = []
  data.technologies.forEach(function (tech) {
    tech.require.forEach(function (requirement) {
      links.push({
        source: nodes.find(node => node.name === tech.name),
        target: nodes.find(node => node.name === requirement)
      })
    })
  })
  return links
}
