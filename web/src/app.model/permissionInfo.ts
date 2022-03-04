import {RepoItem} from "../framework.core/services/repoService/repoItem";
import {PERMISSION_ENTITY, PERMISSION_LEVEL, PERMISSION_OPERATOR} from "../app.core.api";

export class PermissionInfo extends RepoItem {
  public static class: string = 'PermissionInfo';

  entity: PERMISSION_ENTITY = PERMISSION_ENTITY.NONE;
  operator: PERMISSION_OPERATOR = PERMISSION_OPERATOR.NONE;
  level: PERMISSION_LEVEL = PERMISSION_LEVEL.NONE;

  constructor(id: string)
  {
    super(id);

    this.appendClassName(PermissionInfo.class);
  }
}
