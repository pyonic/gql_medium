import { User } from '@prisma/client';
import * as DataLoader from 'dataloader';
import { mapObjectById } from 'src/common/utils';
import { UserService } from 'src/modules/users/user.service';

const createUsersLoader = async (usersService: UserService) => {
  return new DataLoader<number, User>(
    async (ids: Array<number>): Promise<any> => {
      const users = await usersService.getUserByIds(ids);
      const usersMap = mapObjectById(users);
      return ids.map((id) => usersMap[id] || null);
    },
  );
};

export { createUsersLoader };
