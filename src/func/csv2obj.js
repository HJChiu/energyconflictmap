import date2range from './date2range'

export default ({csvString, tagWorkMapper = null, workTagSet = null, tagSetByCategory = null}) => {
  if (!csvString || csvString.length === 0 || typeof csvString !== 'string') return {}

  let result = {}
  const csv = csvString.split('\n').map((line) => {
    let quoted = false
    let parsedLine = ''
    for (let char of line) {
      if (char === '"') {
        quoted = !quoted
      }
      if (!quoted && char === ',') {
        parsedLine += '\n'
      } else {
        parsedLine += char
      }
    }
    return parsedLine.split('\n').map((cell) => cell.trim().replace(/"/g, ''))
  })
  const titles = csv[0]
  for (let i = 1; i < csv.length; i++) {
    const lineArray = csv[i]
    let resultItem = {}
    titles.forEach((title, titleIndex) => {
      // for works
      if (title.includes('_ids')) {
        if (lineArray[titleIndex].length === 0) {
          resultItem[title] = []
        } else {
          resultItem[title] = lineArray[titleIndex].split(';').map((tagId) => {
            const trimedTagId = tagId.trim()
            if (workTagSet) {
              workTagSet.add(trimedTagId)
            }
            if (tagWorkMapper) {
              if (tagWorkMapper[trimedTagId] === undefined) {
                tagWorkMapper[trimedTagId] = new Set()
              }
              tagWorkMapper[trimedTagId].add(lineArray[titles.indexOf('id')])
            }
            return trimedTagId
          })
        }
      // for all
      } else {
        resultItem[title] = lineArray[titleIndex]
      }
    })
    // for category
    if (resultItem.parent_id === undefined && tagSetByCategory) {
      tagSetByCategory[resultItem.id] = new Set()
    }
    // for tag
    if (resultItem.category_id && tagSetByCategory) {
      tagSetByCategory[resultItem.category_id].add(resultItem.id)
    }
    // for works
    if (resultItem.started ||
      resultItem.ended ||
      resultItem.updated) {
      resultItem.duration = date2range(resultItem.started, resultItem.ended, resultItem.updated)
    }
    if (resultItem.subject_tag_ids) {
      resultItem.complete_subject_tag_ids = new Set()
    }
    // for all
    result[resultItem.id] = resultItem
  }
  return result
}
