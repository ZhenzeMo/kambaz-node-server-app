import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";

export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    const course = await model.findById(courseId);
    return course?.modules || [];
  }

  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4() };
    console.log('Attempting to update course:', courseId);
    const status = await model.updateOne(
      { _id: courseId },
      { $push: { modules: newModule } }
    );
    console.log('Update status:', JSON.stringify(status));
    console.log('Matched:', status.matchedCount, 'Modified:', status.modifiedCount);
    
    if (status.matchedCount === 0) {
      throw new Error(`Course with id ${courseId} not found`);
    }
    if (status.modifiedCount === 0) {
      throw new Error(`Course ${courseId} found but not modified. Check if modules field exists.`);
    }
    return newModule;
  }

  async function deleteModule(courseId, moduleId) {
    const status = await model.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
    return status;
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const course = await model.findById(courseId);
    const module = course.modules.id(moduleId);
    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}

