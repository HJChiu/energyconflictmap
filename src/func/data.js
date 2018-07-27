import csv2obj from './csv2obj'
import obj2tree from './obj2tree'
import tag2category from './tag2category'
import mapWorkTagFromTree from './mapWorkTagFromTree'
import minusSet from './minusSet'

export default ({categoryCsv, tagCsv, workCsv}) => {
  if (!categoryCsv || !tagCsv || !workCsv) return null

  let tagSetByCategory = {}
  const categoryObj = csv2obj({csvString: categoryCsv, tagSetByCategory})
  const tagObj = csv2obj({csvString: tagCsv, tagSetByCategory})
  const tagSet = new Set(Object.keys(tagObj))
  let tagWorkMapper = {}
  let workTagSet = new Set()
  let workObj = csv2obj({csvString: workCsv, tagWorkMapper, workTagSet, tagSetByCategory})

  // make sure all tags have their place in the tag sheet
  if (minusSet(workTagSet, tagSet).size > 0) {
    console.log(minusSet(workTagSet, tagSet))
  }

  const workTree = obj2tree(workObj)
  const tagTree = obj2tree(tagObj)

  mapWorkTagFromTree({tagTree, path: [], tagWorkMapper})

  for (const tagId of tagSetByCategory.subject) {
    for (const workId of tagWorkMapper[tagId]) {
      workObj[workId].complete_subject_tag_ids.add(tagId)
    }
  }

  const tagCategory = tag2category({tagTree, tagObj, workObj})

  return {
    categoryObj,
    tagObj,
    tagSet,
    tagWorkMapper,
    workTagSet,
    workObj,
    workTree,
    tagTree,
    tagCategory
  }
}