import { userRepository } from '../data-source';
import { Role, User } from '../entity/User';
import bcrypt from 'bcrypt';

export const initAdmin = async () => {
  if (await userRepository.findOneByOrFail({ username: 'admin' })) {
    return console.log('admin user already exists, skipping');
  }

  const admin = new User();
  admin.username = 'admin';
  admin.role = Role.ADMIN;
  admin.email = 'admin@admin.fi';
  admin.info = 'this is an automatically created admin user';
  admin.passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

  await userRepository.save(admin);
  console.log('admin user created');
};
