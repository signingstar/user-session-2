import layoutPresenter from "tisko-layout";

const respondError = ({err, pageConfig}, modules) => {
  const { jsAsset, page, renderHTML, responders } = modules;

  page.set(pageConfig);
  page.set({message: err.detail || err.message});
  layoutPresenter({topNav:false}, page, {jsAsset});

  responders.html(renderHTML(page));
}

export default respondError;
