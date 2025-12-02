import ModulesDao from "./dao.js";

export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);

  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    console.log('Finding modules for course:', courseId);
    const modules = await dao.findModulesForCourse(courseId);
    console.log('Found', modules?.length || 0, 'modules');
    res.json(modules);
  };

  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    console.log('Creating module for course:', courseId, 'Module:', req.body);
    const module = {
      ...req.body,
    };
    try {
      const newModule = await dao.createModule(courseId, module);
      console.log('Module created successfully:', newModule._id);
      res.send(newModule);
    } catch (error) {
      console.error('Error creating module for course', courseId, ':', error.message);
      res.status(500).json({ error: error.message });
    }
  };

  const deleteModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const status = await dao.deleteModule(courseId, moduleId);
    res.send(status);
  };

  const updateModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const moduleUpdates = req.body;
    const status = await dao.updateModule(courseId, moduleId, moduleUpdates);
    res.send(status);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
}

