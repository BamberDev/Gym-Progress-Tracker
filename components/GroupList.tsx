import GroupCard from "./GroupCard";

export default function GroupList({
  groups,
  onUpdate,
  onDelete,
}: GroupListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <GroupCard
          key={group._id}
          group={group}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
