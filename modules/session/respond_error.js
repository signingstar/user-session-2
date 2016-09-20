import layoutPresenter from "tisko-layout";

const respondError = ({err, pageConfig}, modules) => {
  const { jsAsset, page, renderHTML, responders } = modules;
  console.log(`err:${err}`);

  page.set(pageConfig);
  page.set({message: err.detail || err.message});
  console.log(`page:${JSON.stringify(page)}`);
  layoutPresenter({topNav:false}, page, {jsAsset});

  responders.html(renderHTML(page));
}

export default respondError;
