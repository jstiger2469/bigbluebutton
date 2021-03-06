import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RedisPubSub from '/imports/startup/server/redis';
import Logger from '/imports/startup/server/logger';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function changeRole(userId, role) {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'ChangeUserRoleCmdMsg';

  const { meetingId, requesterUserId } = extractCredentials(this.userId);

  check(userId, String);
  check(role, String);

  const payload = {
    userId,
    role,
    changedBy: requesterUserId,
  };

  Logger.verbose(`User '${userId}' set as '${role} role by '${requesterUserId}' from meeting '${meetingId}'`);

  return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}
